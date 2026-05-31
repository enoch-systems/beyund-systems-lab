"use client";

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
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-5 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          {title}
        </span>
        <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
          {value}
        </span>
        {change && (
          <span
            className={`text-xs font-medium px-1.5 py-0.5 rounded ${
              changeType === "positive"
                ? "bg-emerald-500/10 text-emerald-500"
                : changeType === "negative"
                  ? "bg-red-500/10 text-red-500"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
            }`}
          >
            {changeType === "positive" ? "↗" : changeType === "negative" ? "↘" : "~"} {change}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-xs text-neutral-500 dark:text-neutral-500">{subtitle}</p>
      )}
    </div>
  );
}