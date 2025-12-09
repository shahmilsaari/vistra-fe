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

type RecentRemarksProps = {
  remarks: RecentRemark[];
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

export function RecentRemarks({ remarks }: RecentRemarksProps) {
  if (remarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-3 rounded-full bg-neutral-100 p-3 dark:bg-neutral-800">
          <svg className="size-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No recent remarks</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {remarks.map((remark) => (
        <Link
          key={remark.id}
          href={`/attachments/${remark.attachment.id}`}
          className="flex items-start gap-4 rounded-lg border border-neutral-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-blue-600"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <svg className="size-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="line-clamp-1 text-sm font-medium text-neutral-900 dark:text-white">{remark.title}</h3>
            <p className="mt-1 line-clamp-1 text-xs text-neutral-500 dark:text-neutral-400">
              On: {remark.attachment.name}
            </p>
            <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">{formatDate(remark.createdAt)}</p>
          </div>
          <svg className="size-5 shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ))}
    </div>
  );
}
