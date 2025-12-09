"use client";

type ActivityItem = {
  id: number;
  title: string;
  time: string;
  type: "meeting" | "upload" | "comment" | "share";
};

type RecentActivityProps = {
  activities?: ActivityItem[];
};

const defaultActivities: ActivityItem[] = [
  { id: 1, title: "Review Q4 Reports", time: "02:00 pm - 04:00 pm", type: "meeting" },
  { id: 2, title: "Upload Design Assets", time: "10:30 am", type: "upload" },
  { id: 3, title: "Comment on Proposal", time: "09:15 am", type: "comment" },
];

export function RecentActivity({ activities = defaultActivities }: RecentActivityProps) {
  const primaryActivity = activities[0];

  return (
    <div className="rounded-2xl bg-white p-6 dark:bg-neutral-800">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Reminders</h3>
      </div>

      {primaryActivity && (
        <div className="space-y-4">
          <div>
            <h4 className="text-xl font-semibold text-neutral-900 dark:text-white">
              {primaryActivity.title}
            </h4>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Time: {primaryActivity.time}
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Start Meeting
          </button>
        </div>
      )}

      {activities.length > 1 && (
        <div className="mt-6 space-y-3 border-t border-neutral-100 pt-4 dark:border-neutral-700">
          {activities.slice(1).map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 text-sm">
              <div className="flex size-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-700">
                {activity.type === "upload" && (
                  <svg className="size-4 text-neutral-600 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                )}
                {activity.type === "comment" && (
                  <svg className="size-4 text-neutral-600 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-900 dark:text-white">{activity.title}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
