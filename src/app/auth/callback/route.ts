import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/auth/profiles";
import { getRole, roleHome } from "@/lib/auth/roles";
import { isSupabaseConfigured } from "@/lib/auth/config";
import { safeNext } from "@/lib/url";

/**
 * Handles OAuth and email-link callbacks.
 * Exchanges the code for a session, ensures an idempotent profile row,
 * then redirects to the safe `next` target or the user's role home.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));

  if (!isSupabaseConfigured() || !code) {
    return NextResponse.redirect(`${origin}/login?error=callback_failed`);
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=callback_failed`);
  }

  // Idempotent: safe on retries, never overwrites an existing role.
  await ensureProfile(supabase, data.user);
  const role = await getRole(supabase, data.user.id);

  return NextResponse.redirect(`${origin}${next ?? roleHome(role)}`);
}
