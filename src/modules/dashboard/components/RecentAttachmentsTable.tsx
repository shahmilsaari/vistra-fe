"use client";

import Link from "next/link";
import { FileIcon } from "@/components/ui/FileIcon";

type RecentAttachment = {
  id: number;
  name: string;
  kind: string;
  size: number;
  mime: string;
  path: string;
  storageUrl: string;
  createdAt: string;
};

type RecentAttachmentsTableProps = {
  attachments: RecentAttachment[];
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
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

export function RecentAttachmentsTable({ attachments }: RecentAttachmentsTableProps) {
  if (attachments.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No recent files</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="space-y-3">
        {attachments.map((attachment) => (
          <Link
            key={attachment.id}
            href={`/attachments/${attachment.id}`}
            className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3 transition-all hover:border-blue-500 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:border-blue-500 dark:hover:bg-neutral-700/50"
          >
            <div className="flex-shrink-0">
              <FileIcon kind={attachment.kind} className="size-8" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                {attachment.name}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="truncate">{attachment.path || "/"}</span>
                <span>•</span>
                <span>{formatBytes(attachment.size)}</span>
              </div>
            </div>
            <div className="flex-shrink-0 text-right">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                {attachment.kind.toUpperCase()}
              </span>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                {formatRelativeTime(attachment.createdAt)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
