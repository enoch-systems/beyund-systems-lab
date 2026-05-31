import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy (formerly middleware in < Next.js 16)
 *
 * Protects admin routes by checking for a Supabase auth session cookie.
 * Unauthenticated users are redirected to the login page.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes (but not the login page itself)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    // Check for Supabase auth session cookie
    // Supabase SSR sets cookies like: sb-<project-ref>-auth-token
    const supabaseCookie = request.cookies.get("sb-auth-token");

    // Also check for any cookie that starts with "sb-" (Supabase auth cookies)
    const hasSupabaseAuth = request.cookies.getAll().some(
      (cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("auth")
    );

    if (!supabaseCookie && !hasSupabaseAuth) {
      // No auth session found — redirect to login
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all admin routes except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (metadata file)
     */
    "/admin/:path*",
  ],
};