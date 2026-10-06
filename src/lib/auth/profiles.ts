import type { SupabaseClient, User } from "@supabase/supabase-js";

/**
 * Idempotent profile creation, shared by server actions and the auth callback.
 * - Never overwrites an existing row (a role granted by an admin is preserved).
 * - Never assigns anything but "student" — admin can never be self-assigned.
 * - Safe to call on retries: repeated calls are no-ops.
 */
export async function ensureProfile(
  supabase: SupabaseClient,
  user: User,
  fullName?: string,
  referralCode?: string | null
): Promise<void> {
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (existing) return;

  await supabase.from("profiles").insert({
    id: user.id,
    email: user.email,
    full_name:
      fullName ?? (user.user_metadata?.full_name as string | undefined) ?? null,
    role: "student",
    referral_code:
      referralCode ??
      (user.user_metadata?.referral_code as string | undefined) ??
      null,
  });
}
