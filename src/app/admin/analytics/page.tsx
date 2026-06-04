"use client";

import { BarChart3, Lock } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="w-16 h-16 rounded-[18px] bg-[#f2f2f7] dark:bg-[#2c2c2e] flex items-center justify-center mb-5">
        <BarChart3 className="w-8 h-8 text-[#86868b]" />
      </div>
      <h1 className="text-[20px] font-semibold text-neutral-900 dark:text-white tracking-[-0.02em]">
        Analytics
      </h1>
      <p className="text-[11px] text-[#86868b] dark:text-[#98989d] mt-1.5 max-w-sm text-center">
        Detailed analytics and reporting tools are coming soon.
      </p>
      <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[#f2f2f7] dark:bg-[#2c2c2e] text-[11px] font-medium text-[#86868b] dark:text-[#98989d]">
        <Lock className="w-3 h-3" />
        Coming Soon
      </div>
    </div>
  );
}