"use client";

import Link from "next/link";

type RecentRemark = {
  id: number;
  title: string;
  attachment: {
    id: number;
    name: string;
  };
  createdAt: string;
};

type RecentRemarksPanelProps = {
  remarks: RecentRemark[];
};

const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
};

export function RecentRemarksPanel({ remarks }: RecentRemarksPanelProps) {
  if (remarks.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No recent remarks</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="space-y-3">
        {remarks.map((remark) => (
          <Link
            key={remark.id}
            href={`/attachments/${remark.attachment.id}`}
            className="block rounded-lg border border-neutral-200 p-3 transition-all hover:border-purple-500 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:border-purple-500 dark:hover:bg-neutral-700/50"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <svg
                    className="size-4 flex-shrink-0 text-purple-600 dark:text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                  <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                    {remark.title}
                  </p>
                </div>
                <p className="mt-1 truncate text-xs text-neutral-500 dark:text-neutral-400">
                  on {remark.attachment.name}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {formatRelativeTime(remark.createdAt)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
