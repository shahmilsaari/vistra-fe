import Link from "next/link";
import { FileIcon } from "@/components/ui";

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

type RecentAttachmentsProps = {
  attachments: RecentAttachment[];
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export function RecentAttachments({ attachments }: RecentAttachmentsProps) {
  if (attachments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-3 rounded-full bg-neutral-100 p-3 dark:bg-neutral-800">
          <svg className="size-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No recent files</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {attachments.map((attachment) => (
        <Link
          key={attachment.id}
          href={`/attachments/${attachment.id}`}
          className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-blue-600"
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-700">
            <FileIcon kind={attachment.kind} mime={attachment.mime} name={attachment.name} className="size-6 text-neutral-600 dark:text-neutral-300" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="truncate text-sm font-medium text-neutral-900 dark:text-white">{attachment.name}</h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span>{formatBytes(attachment.size)}</span>
              <span>•</span>
              <span>{formatDate(attachment.createdAt)}</span>
              {attachment.path && (
                <>
                  <span>•</span>
                  <span className="truncate">{attachment.path}</span>
                </>
              )}
            </div>
          </div>
          <svg className="size-5 shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ))}
    </div>
  );
}
