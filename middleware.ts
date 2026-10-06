import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isSupabaseConfigured } from "@/lib/auth/config";
import { getRole, roleHome } from "@/lib/auth/roles";
import { safeNext } from "@/lib/url";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/auth/callback",
  "/access-denied",
  "/session-expired",
];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export async function middleware(request: NextRequest) {
  // Without Supabase credentials every page renders its configuration state.
  if (!isSupabaseConfigured()) return NextResponse.next();

  const { pathname, searchParams } = request.nextUrl;
  const { supabase, response, user } = await updateSession(request);

  if (!user) {
    if (isPublic(pathname)) return response;
    // Protected route → login, remembering the intended safe page.
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Signed-in users don't need the auth forms.
  if (pathname === "/login" || pathname === "/signup") {
    const role = await getRole(supabase, user.id);
    const url = request.nextUrl.clone();
    url.pathname = safeNext(searchParams.get("next")) ?? roleHome(role);
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Privileged areas: server-side role check, never just hidden nav.
  if (pathname.startsWith("/admin") || pathname.startsWith("/mentor")) {
    const role = await getRole(supabase, user.id);
    const allowed =
      pathname.startsWith("/admin") ? role === "admin" : role !== "student";
    if (!allowed) {
      const url = request.nextUrl.clone();
      url.pathname = "/access-denied";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
