"use client";

import { apple } from "@/admin-design-system";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  subtitle?: string;
  icon: React.ReactNode;
}

export default function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  subtitle,
  icon,
}: StatCardProps) {
  return (
    <div className={`${apple.radius.card} ${apple.surface.card} ${apple.border} ${apple.shadow.sm} p-5 transition-all duration-300 hover:${apple.shadow.md}`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${apple.text.micro} uppercase tracking-[0.04em]`}>
          {title}
        </span>
        <div className="w-8 h-8 rounded-[10px] bg-[#f2f2f7] dark:bg-[#181818] flex items-center justify-center text-[#86868b] dark:text-[#98989d]">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-white leading-none">
          {value}
        </span>
        {change && (
          <span
            className={`inline-flex items-center gap-0.5 text-[13px] font-medium px-1.5 py-0.5 rounded-[6px] ${
              changeType === "positive"
                ? "bg-[#30b94e]/10 text-[#30b94e] dark:bg-[#30d158]/15 dark:text-[#30d158]"
                : changeType === "negative"
                  ? "bg-[#d6453e]/10 text-[#d6453e] dark:bg-[#ff453a]/15 dark:text-[#ff453a]"
                  : "bg-[#f2f2f7] dark:bg-[#181818] text-[#86868b] dark:text-[#98989d]"
            }`}
          >
            {changeType === "positive" ? "↑" : changeType === "negative" ? "↓" : "→"} {change}
          </span>
        )}
      </div>
      {subtitle && (
        <p className={`${apple.text.micro} mt-0.5`}>{subtitle}</p>
      )}
    </div>
  );
}