"use client";

import { BarChart3, Lock } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="w-16 h-16 rounded-[18px] bg-[#f2f2f7] dark:bg-[#2c2c2e] flex items-center justify-center mb-5">
        <BarChart3 className="w-8 h-8 text-[#86868b]" />
      </div>
      <h1 className="text-[22px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.02em]">
        Analytics
      </h1>
      <p className="text-[15px] text-[#86868b] dark:text-[#98989d] mt-2 max-w-sm text-center">
        Detailed analytics and reporting tools are coming soon.
      </p>
      <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] text-[13px] font-medium text-[#86868b] dark:text-[#98989d]">
        <Lock className="w-3.5 h-3.5" />
        Coming Soon
      </div>
    </div>
  );
}