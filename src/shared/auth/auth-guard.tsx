"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthSession } from "./use-auth-session";

interface AuthGuardProps {
  children: React.ReactNode;
  loginPath?: string;
  /** Fallback UI while checking auth. If not provided, renders nothing. */
  loadingFallback?: React.ReactNode;
}

/**
 * Client-side auth guard component.
 * Wraps protected routes and redirects to login if unauthenticated.
 * Uses useAuthSession which subscribes to onAuthStateChange for reactive session tracking.
 */
export function AuthGuard({
  children,
  loginPath = "/admin/login",
  loadingFallback = null,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuthSession();
  const router = useRouter();
  const pathname = usePathname();
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      redirectedRef.current = false;
      return;
    }
    // Prevent double redirects in strict mode
    if (redirectedRef.current) return;
    redirectedRef.current = true;

    // Only redirect if we're not already on the login page
    if (pathname !== loginPath) {
      router.push(loginPath);
    }
  }, [isAuthenticated, isLoading, pathname, loginPath, router]);

  // On login page — always render children (login form)
  if (pathname === loginPath) {
    return <>{children}</>;
  }

  // Loading state — show fallback or nothing
  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  // Authenticated — render children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Not authenticated and not on login page — render nothing while redirect happens
  return null;
}