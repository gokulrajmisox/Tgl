/** Environment-derived configuration. Never put secrets here that the browser shouldn't see. */

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isGoogleOAuthEnabled(): boolean {
  return (
    isSupabaseConfigured() &&
    process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === "true"
  );
}

/** Public site URL used to build redirect links. Never built from user input. */
export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    ""
  );
}
