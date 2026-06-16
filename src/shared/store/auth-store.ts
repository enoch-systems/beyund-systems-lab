import { create } from "zustand";

interface AdminAuthState {
  adminEmail: string | null;
  adminName: string;
  setAdmin: (email: string) => void;
  setAdminName: (name: string) => void;
  clearAdmin: () => void;
}

/**
 * Admin auth store — in-memory only (no persistence).
 * Session persistence is handled by Supabase cookies, not localStorage.
 * This avoids stale-state issues on page refresh.
 */
export const useAdminAuthStore = create<AdminAuthState>()(
  (set) => ({
    adminEmail: null,
    adminName: "",
    setAdmin: (email) => set({ adminEmail: email }),
    setAdminName: (name) => set({ adminName: name }),
    clearAdmin: () => set({ adminEmail: null, adminName: "" }),
  })
);


