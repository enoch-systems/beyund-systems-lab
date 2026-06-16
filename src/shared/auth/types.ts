export interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
  isLoading: boolean;
  userId: string | null;
}