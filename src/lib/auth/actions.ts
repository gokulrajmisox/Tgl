"use server";

import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, siteUrl } from "@/lib/auth/config";
import { getRole, roleHome } from "@/lib/auth/roles";
import { ensureProfile } from "@/lib/auth/profiles";
import { safeNext } from "@/lib/url";

export type ActionResult = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  message?: string;
  redirectTo?: string;
  oauthUrl?: string;
};

const emailSchema = z.string().trim().min(1, "Enter your email address.").email("Enter a valid email address.");
const passwordSchema = z.string().min(8, "Use at least 8 characters.");

const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password."),
});

const signUpSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name."),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password."),
    referralCode: z.string().trim().max(32).optional().or(z.literal("")),
    terms: z.literal(true, {
      errorMap: () => ({ message: "Please accept the Terms and Privacy Policy." }),
    }),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

const newPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your new password."),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

function notConfigured(): ActionResult {
  return {
    ok: false,
    error:
      "Authentication isn't configured yet. Add your Supabase credentials to get started.",
  };
}

/** Map Supabase / network errors to concise, user-friendly messages. */
function mapAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "We couldn't sign you in. Check your details and try again.";
  if (m.includes("user already registered") || m.includes("already exists"))
    return "An account with this email already exists. Try signing in instead.";
  if (m.includes("email not confirmed") || m.includes("not confirmed"))
    return "Please check your email to verify your account first.";
  if (m.includes("too many") || m.includes("rate limit") || m.includes("429"))
    return "Too many attempts. Please wait a bit and try again.";
  if (m.includes("expired") || m.includes("invalid") && m.includes("token"))
    return "This link has expired. Request a new one and try again.";
  if (m.includes("network") || m.includes("fetch failed") || m.includes("timeout"))
    return "We couldn't reach the server. Check your connection and try again.";
  if (m.includes("password") && m.includes("weak"))
    return "That password is too weak. Try a longer one.";
  return "Something went wrong. Please try again.";
}

function fieldErrorsFromZod(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export async function signInAction(
  input: z.infer<typeof signInSchema>
): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return notConfigured();
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, fieldErrors: fieldErrorsFromZod(parsed.error) };

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error || !data.user)
    return { ok: false, error: mapAuthError(error?.message ?? "sign in failed") };

  await ensureProfile(supabase, data.user);
  const role = await getRole(supabase, data.user.id);
  return { ok: true, message: "Welcome back. You're signed in.", redirectTo: roleHome(role) };
}

export async function signUpAction(
  input: z.infer<typeof signUpSchema>
): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return notConfigured();
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, fieldErrors: fieldErrorsFromZod(parsed.error) };

  const { fullName, email, password, referralCode } = parsed.data;
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        // Stored as metadata only. Role is ALWAYS 'student' at signup —
        // admin can never be self-assigned.
        referral_code: referralCode || null,
      },
      emailRedirectTo: `${siteUrl()}/auth/callback?next=/dashboard`,
    },
  });
  if (error || !data.user)
    return { ok: false, error: mapAuthError(error?.message ?? "sign up failed") };

  // Email confirmation disabled → session exists, go straight in.
  if (data.session) {
    await ensureProfile(supabase, data.user, fullName, referralCode || null);
    const role = await getRole(supabase, data.user.id);
    return {
      ok: true,
      message: "Welcome to TGL. Your account is ready.",
      redirectTo: roleHome(role),
    };
  }

  return {
    ok: true,
    message: "Please check your email to verify your account.",
    redirectTo: `/verify-email?email=${encodeURIComponent(email)}`,
  };
}

export async function signOutAction(): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return notConfigured();
  const supabase = getSupabaseServerClient();
  await supabase.auth.signOut();
  return { ok: true, redirectTo: "/login" };
}

/**
 * Never reveals whether the email exists — always returns the same message.
 */
export async function requestPasswordResetAction(email: string): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return notConfigured();
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success)
    return { ok: false, fieldErrors: { email: parsed.error.issues[0]?.message ?? "Enter a valid email address." } };

  const supabase = getSupabaseServerClient();
  await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${siteUrl()}/auth/callback?next=/reset-password`,
  });
  return {
    ok: true,
    message: "If an account matches that email, you'll receive reset instructions.",
  };
}

export async function updatePasswordAction(
  input: z.infer<typeof newPasswordSchema>
): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return notConfigured();
  const parsed = newPasswordSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, fieldErrors: fieldErrorsFromZod(parsed.error) };

  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return {
      ok: false,
      error: "This reset link has expired. Request a new one and try again.",
    };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { ok: false, error: mapAuthError(error.message) };
  return { ok: true, message: "Your password has been updated.", redirectTo: "/login" };
}

export async function resendVerificationAction(email: string): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return notConfigured();
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success)
    return { ok: false, fieldErrors: { email: "Enter a valid email address." } };

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: parsed.data,
    options: { emailRedirectTo: `${siteUrl()}/auth/callback?next=/dashboard` },
  });
  if (error) return { ok: false, error: mapAuthError(error.message) };
  return { ok: true, message: "Verification email sent. Check your inbox." };
}

export async function getGoogleOAuthUrl(next?: string): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return notConfigured();
  const supabase = getSupabaseServerClient();
  const redirectTo = `${siteUrl()}/auth/callback?next=${encodeURIComponent(
    safeNext(next) ?? "/dashboard"
  )}`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
  if (error || !data.url) return { ok: false, error: mapAuthError(error?.message ?? "oauth failed") };
  return { ok: true, oauthUrl: data.url };
}
