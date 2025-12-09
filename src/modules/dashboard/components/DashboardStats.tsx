"use client";

import Link from "next/link";

type DashboardStatsProps = {
  totalAttachments: number;
  totalStorage: number;
  totalRemarks: number;
  totalFolders: number;
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

type StatCardProps = {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; label: string };
  variant?: "primary" | "default";
  href?: string;
};

function StatCard({ label, value, subtitle, trend, variant = "default", href }: StatCardProps) {
  const isPrimary = variant === "primary";

  const content = (
    <div
      className={`group relative rounded-2xl p-5 transition-all hover:shadow-md ${
        isPrimary
          ? "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white"
          : "bg-white dark:bg-neutral-800"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className={`text-sm font-medium ${isPrimary ? "text-emerald-100" : "text-neutral-500 dark:text-neutral-400"}`}>
            {label}
          </p>
          <p className={`text-4xl font-bold tracking-tight ${isPrimary ? "text-white" : "text-neutral-900 dark:text-white"}`}>
            {value}
          </p>
          {subtitle && (
            <p className={`text-xs ${isPrimary ? "text-emerald-200" : "text-neutral-400 dark:text-neutral-500"}`}>
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={`flex size-9 items-center justify-center rounded-full transition-transform group-hover:scale-110 ${
            isPrimary ? "bg-white/20" : "bg-neutral-100 dark:bg-neutral-700"
          }`}
        >
          <svg
            className={`size-4 ${isPrimary ? "text-white" : "text-neutral-600 dark:text-neutral-300"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${
              isPrimary
                ? "bg-white/20 text-white"
                : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
            }`}
          >
            <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            {trend.value}
          </span>
          <span className={`text-xs ${isPrimary ? "text-emerald-200" : "text-neutral-500 dark:text-neutral-400"}`}>
            {trend.label}
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

export function DashboardStats({ totalAttachments, totalStorage, totalRemarks, totalFolders }: DashboardStatsProps) {
  const stats = [
    {
      label: "Total Files",
      value: totalAttachments || 24,
      trend: { value: 5, label: "Increased from last month" },
      variant: "primary" as const,
    },
    {
      label: "Storage Used",
      value: formatBytes(totalStorage) || "2.4 GB",
      trend: { value: 6, label: "Increased from last month" },
      variant: "default" as const,
    },
    {
      label: "Total Remarks",
      value: totalRemarks || 12,
      trend: { value: 2, label: "Increased from last month" },
      variant: "default" as const,
    },
    {
      label: "Total Folders",
      value: totalFolders || 2,
      subtitle: "Organized",
      variant: "default" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
