import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminAuthState {
  adminEmail: string | null;
  adminName: string;
  setAdmin: (email: string) => void;
  setAdminName: (name: string) => void;
  clearAdmin: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      adminEmail: null,
      adminName: "",
      setAdmin: (email) => set({ adminEmail: email }),
      setAdminName: (name) => set({ adminName: name }),
      clearAdmin: () => set({ adminEmail: null, adminName: "" }),
    }),
    { name: "beyund-admin-auth" }
  )
);