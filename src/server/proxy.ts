import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy (formerly middleware in < Next.js 16)
 *
 * Protects admin and students-portal routes by checking for Supabase auth.
 * Unauthenticated users are redirected to the appropriate login page.
 * The landing page (/) is NOT matched — it loads instantly with no auth delay.
 *
 * Note: Next.js 16 requires the proxy function to be exported as the
 * `default` export of the module. The runtime adapter invokes
 * `module.default(module.proxy, ...)` so the function must be the default
 * export. We re-export it under the `proxy` name as well for consistency
 * with the documented public API.
 */
function proxy(request: NextRequest) {
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

  // Protect students-portal routes (but not the login page itself)
  if (pathname.startsWith("/students-portal") && pathname !== "/students-portal/login") {
    const supabaseCookie = request.cookies.get("sb-auth-token");
    const hasSupabaseAuth = request.cookies.getAll().some(
      (cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("auth")
    );

    if (!supabaseCookie && !hasSupabaseAuth) {
      const loginUrl = new URL("/students-portal/login", request.url);
      loginUrl.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export default proxy;
export { proxy };

export const config = {
  matcher: [
    /*
     * Only match auth-required routes — NOT the landing page.
     * This eliminates the 1-3s delay on landing page load caused by
     * unnecessary auth checks for public pages.
     */
    "/admin/:path*",
    "/students-portal/:path*",
  ],
};