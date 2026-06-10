/**
 * 2026 Apple-Inspired Design System
 * Minimal, calm, premium — like iOS Settings + VisionOS
 */

export const apple = {
  /* ── Surface colors ── */
  surface: {
    /** Main card/surface background */
    card: "bg-white/80 dark:bg-[#1c1c1e]/90 backdrop-blur-[20px]",
    /** Slightly elevated surface */
    elevated: "bg-white/90 dark:bg-[#2c2c2e]/90 backdrop-blur-[30px]",
    /** Tinted glass surface */
    glass: "bg-white/60 dark:bg-white/5 backdrop-blur-[40px]",
    /** Sidebar */
    sidebar: "bg-[#f9f9f9]/90 dark:bg-[#101010]/95 backdrop-blur-[40px]",
    /** Canvas / page background */
    canvas: "bg-[#f5f5f7] dark:bg-black",
    /** Input background */
    input: "bg-[#f2f2f7] dark:bg-[#2c2c2e]",
  },

  /* ── Border ── */
  border: "border-[#e5e5ea]/80 dark:border-[#38383a]/60",
  borderLight: "border-[#e5e5ea]/40 dark:border-[#38383a]/30",

  /* ── Shadows (extremely soft) ── */
  shadow: {
    sm: "shadow-[0_1px_3px_-1px_rgba(0,0,0,0.04)]",
    md: "shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06),0_1px_4px_-2px_rgba(0,0,0,0.02)]",
    lg: "shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08),0_2px_8px_-4px_rgba(0,0,0,0.04)]",
    glow: "shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_4px_16px_-8px_rgba(0,0,0,0.1)]",
  },

  /* ── Typography ── */
  text: {
    hero: "text-[28px] sm:text-[32px] font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-white",
    title: "text-[17px] font-semibold tracking-[-0.01em] text-[#1d1d1f] dark:text-white",
    body: "text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7]",
    caption: "text-[13px] text-[#86868b] dark:text-[#98989d]",
    micro: "text-[11px] text-[#86868b] dark:text-[#98989d] tracking-[-0.01em]",
    badge: "text-[12px] font-medium tracking-[-0.01em]",
  },

  /* ── Semantic colors (used sparingly) ── */
  semantic: {
    green: "text-[#30b94e] dark:text-[#30d158]",
    amber: "text-[#d49a2a] dark:text-[#ff9f0a]",
    red: "text-[#d6453e] dark:text-[#ff453a]",
    blue: "text-[#007aff] dark:text-[#0a84ff]",
    purple: "text-[#8940fa] dark:text-[#bf5af2]",
  },

  /* ── Badge backgrounds ── */
  badgeBg: {
    green: "bg-[#30b94e]/10 dark:bg-[#30d158]/15",
    amber: "bg-[#d49a2a]/10 dark:bg-[#ff9f0a]/15",
    red: "bg-[#d6453e]/10 dark:bg-[#ff453a]/15",
    blue: "bg-[#007aff]/10 dark:bg-[#0a84ff]/15",
  },

  /* ── Radius ── */
  radius: {
    card: "rounded-[14px]",
    pill: "rounded-[20px]",
    button: "rounded-[10px]",
    input: "rounded-[10px]",
    avatar: "rounded-full",
  },
} as const;

/** Apple-style component classname builders */
export function statusStyle(status: string) {
  const map: Record<string, string> = {
    in_progress: `${apple.badgeBg.green} ${apple.semantic.green}`,
    upcoming: `${apple.badgeBg.amber} ${apple.semantic.amber}`,
    cancelled: `${apple.badgeBg.red} ${apple.semantic.red}`,
    enrolled: `${apple.badgeBg.green} ${apple.semantic.green}`,
    contacted: `${apple.badgeBg.blue} ${apple.semantic.blue}`,
    pending: `${apple.badgeBg.amber} ${apple.semantic.amber}`,
    rejected: `${apple.badgeBg.red} ${apple.semantic.red}`,
  };
  return map[status] || "";
}

export function statusDot(status: string) {
  const map: Record<string, string> = {
    in_progress: "bg-[#30d158]",
    upcoming: "bg-[#ff9f0a]",
    cancelled: "bg-[#ff453a]",
    enrolled: "bg-[#30d158]",
    contacted: "bg-[#0a84ff]",
    pending: "bg-[#ff9f0a]",
    rejected: "bg-[#ff453a]",
  };
  return map[status] || "bg-[#86868b]";
}

export function statusLabel(status: string) {
  const map: Record<string, string> = {
    in_progress: "In Progress",
    upcoming: "Upcoming",
    cancelled: "Cancelled",
    enrolled: "Enrolled",
    contacted: "Contacted",
    pending: "Pending",
    rejected: "Rejected",
  };
  return map[status] || status;
}