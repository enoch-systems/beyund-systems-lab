/* ── Theme-aware color palettes ── */

export type Theme = "dark" | "light";

export interface Colors {
  teal: string;
  accent: string;
  green: string;
  amber: string;
  red: string;
  bg: string;
  sidebarBg: string;
  sidebarActive: string;
  card: string;
  border: string;
  text: string;
  muted: string;
  dim: string;
}

export const darkColors: Colors = {
  teal: "#14b8a6",
  accent: "#6b7280",
  green: "#22c55e",
  amber: "#eab308",
  red: "#ef4444",
  bg: "#080c1a",
  sidebarBg: "#080c1a",
  sidebarActive: "#1e293b",
  card: "#111827",
  border: "#1e293b",
  text: "#f8fafc",
  muted: "#94a3b8",
  dim: "#475569",
};

export const lightColors: Colors = {
  teal: "#0d9488",
  accent: "#6b7280",
  green: "#16a34a",
  amber: "#ca8a04",
  red: "#dc2626",
  bg: "#f1f5f9",
  sidebarBg: "#ffffff",
  sidebarActive: "#e2e8f0",
  card: "#ffffff",
  border: "#e2e8f0",
  text: "#0f172a",
  muted: "#64748b",
  dim: "#94a3b8",
};

export function getColors(theme: Theme): Colors {
  return theme === "dark" ? darkColors : lightColors;
}