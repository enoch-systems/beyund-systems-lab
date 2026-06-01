/**
 * Admin Design System Tokens
 * Consistent spacing, colors, and component styles
 */

export const tokens = {
  spacing: {
    xs: "2px",
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    "2xl": "20px",
    "3xl": "24px",
    "4xl": "32px",
    "5xl": "40px",
    "6xl": "48px",
  },
  radius: {
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },
  shadow: {
    card: "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
    elevated: "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
    modal: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
  colors: {
    primary: "neutral-900 dark:white",
    success: "emerald",
    warning: "amber",
    error: "red",
    info: "blue",
  },
} as const;

/** Shared classname fragments for consistent components */
export const cn = {
  card: "rounded-xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white dark:bg-neutral-900/60 shadow-[0_1px_3px_0_rgb(0_0_0/0.04),0_1px_2px_-1px_rgb(0_0_0/0.06)]",
  cardHover: "hover:shadow-[0_4px_6px_-1px_rgb(0_0_0/0.07),0_2px_4px_-2px_rgb(0_0_0/0.05)] transition-shadow duration-200",
  sectionHeader: "text-sm font-semibold text-neutral-900 dark:text-white",
  sectionSubtitle: "text-xs text-neutral-500 dark:text-neutral-400",
  iconBox: "w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400 shrink-0",
  interactiveRow: "hover:bg-neutral-50/60 dark:hover:bg-neutral-800/20 transition-colors duration-150",
};