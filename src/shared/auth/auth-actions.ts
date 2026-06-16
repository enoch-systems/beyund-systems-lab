import { createSupabaseBrowserClient } from "@/server/integration/supabase.client";
import { useAdminAuthStore } from "@/shared/store/auth-store";

const supabase = () => createSupabaseBrowserClient();

export async function login(email: string, password: string) {
  const { error } = await supabase().auth.signInWithPassword({ email, password });
  return { error };
}

export async function logout() {
  useAdminAuthStore.getState().clearAdmin();
  await supabase().auth.signOut();
}

export async function getSession() {
  const { data } = await supabase().auth.getSession();
  return data.session;
}

export async function refreshSession() {
  const { data, error } = await supabase().auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}