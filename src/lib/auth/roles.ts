import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Roles are ALWAYS read from the trusted server-side `profiles` table.
 * Never from form fields, URL params, or browser storage.
 * This module is safe to import in Middleware (no next/headers usage).
 */
export type Role = "student" | "mentor" | "admin";

const VALID_ROLES: Role[] = ["student", "mentor", "admin"];

export function roleHome(role: Role): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "mentor":
      return "/mentor/dashboard";
    case "student":
    default:
      return "/dashboard";
  }
}

/** Read the user's role from the profiles table. Defaults to student when absent. */
export async function getRole(
  supabase: SupabaseClient,
  userId: string
): Promise<Role> {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  const role = data?.role as string | undefined;
  return VALID_ROLES.includes(role as Role) ? (role as Role) : "student";
}
