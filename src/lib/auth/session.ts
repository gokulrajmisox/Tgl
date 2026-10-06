import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/auth/config";
import { getRole, type Role } from "@/lib/auth/roles";
import type { User } from "@supabase/supabase-js";

export type SessionInfo =
  | { user: User; role: Role }
  | { user: null; role: null };

/**
 * Server-side session + trusted role. Use in Server Components and pages.
 * Returns a signed-out session when Supabase isn't configured (instead of
 * throwing), so pages render their configuration state.
 */
export async function getSession(): Promise<SessionInfo> {
  if (!isSupabaseConfigured()) return { user: null, role: null };
  try {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { user: null, role: null };
    const role = await getRole(supabase, user.id);
    return { user, role };
  } catch {
    return { user: null, role: null };
  }
}
