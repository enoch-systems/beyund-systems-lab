"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/server/integration/supabase.client";
import { useAdminAuthStore } from "@/shared/store/auth-store";
import type { AuthState } from "./types";

/**
 * Hook that monitors the Supabase auth session reactively.
 * Uses onAuthStateChange to stay in sync with session changes (refresh, expiry, etc.)
 * Solves the "refresh logs me out" issue by:
 *   1. Subscribing to auth state changes (handles token refresh automatically)
 *   2. Verifying session via both getSession() and getUser()
 *   3. Only considering auth complete after both store & session confirm
 */
export function useAuthSession(): AuthState {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    email: null,
    isLoading: true,
    userId: null,
  });

  const supabase = createSupabaseBrowserClient();
  const storeEmail = useAdminAuthStore((s) => s.adminEmail);
  const setAdmin = useAdminAuthStore((s) => s.setAdmin);
  const clearAdmin = useAdminAuthStore((s) => s.clearAdmin);

  const verifySession = useCallback(async (attempt = 1): Promise<void> => {
    // First check: fast session check
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      const email = session.user.email ?? "";
      setAdmin(email);
      setState({
        isAuthenticated: true,
        email,
        isLoading: false,
        userId: session.user.id,
      });
      return;
    }

    // Second check: server-verified check
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const email = user.email ?? "";
      setAdmin(email);
      setState({
        isAuthenticated: true,
        email,
        isLoading: false,
        userId: user.id,
      });
      return;
    }

    // Retry logic: on page load, Supabase cookie may not be ready yet.
    // Retry up to 3 times with exponential backoff to handle cookie propagation delay.
    if (attempt < 3) {
      const delay = attempt * 400; // 400ms, 800ms
      await new Promise(r => setTimeout(r, delay));
      return verifySession(attempt + 1);
    }

    // No session found after all retries - clear store and mark as unauthenticated
    if (storeEmail) {
      clearAdmin();
    }

    setState({ isAuthenticated: false, email: null, isLoading: false, userId: null });
  }, [supabase, storeEmail, setAdmin, clearAdmin]);

  useEffect(() => {
    // Initial verification (with built-in retries)
    verifySession();

    // Subscribe to all auth state changes (handles refresh, expiry, login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      verifySession();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [verifySession, supabase.auth]);

  return state;
}