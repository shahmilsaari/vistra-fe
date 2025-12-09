"use client";

import Link from "next/link";

type FileItem = {
  id: number;
  name: string;
  dueDate: string;
  color: string;
  icon: "doc" | "sheet" | "image" | "code" | "pdf";
};

type RecentFilesProps = {
  files?: FileItem[];
  onNewClick?: () => void;
};

const defaultFiles: FileItem[] = [
  { id: 1, name: "Develop API Endpoints", dueDate: "Nov 26, 2024", color: "#10b981", icon: "code" },
  { id: 2, name: "Onboarding Flow", dueDate: "Nov 28, 2024", color: "#06b6d4", icon: "doc" },
  { id: 3, name: "Build Dashboard", dueDate: "Nov 30, 2024", color: "#f59e0b", icon: "sheet" },
  { id: 4, name: "Optimize Page Load", dueDate: "Dec 5, 2024", color: "#ef4444", icon: "image" },
  { id: 5, name: "Cross-Browser Testing", dueDate: "Dec 6, 2024", color: "#8b5cf6", icon: "pdf" },
];

const IconMap = {
  doc: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  sheet: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    </svg>
  ),
  image: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  code: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  pdf: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
};

export function RecentFiles({ files = defaultFiles, onNewClick }: RecentFilesProps) {
  return (
    <div className="rounded-2xl bg-white p-6 dark:bg-neutral-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Recent Files</h3>
        {onNewClick && (
          <button
            type="button"
            onClick={onNewClick}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New
          </button>
        )}
      </div>

      <div className="space-y-3">
        {files.map((file) => (
          <Link
            key={file.id}
            href={`/attachments/${file.id}`}
            className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
          >
            <div
              className="flex size-9 items-center justify-center rounded-lg text-white"
              style={{ backgroundColor: file.color }}
            >
              {IconMap[file.icon]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                {file.name}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Due date: {file.dueDate}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
