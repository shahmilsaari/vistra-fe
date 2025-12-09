"use client";

type TeamMember = {
  id: number;
  name: string;
  task: string;
  status: "completed" | "in_progress" | "pending";
  avatar: string;
};

type TeamActivityProps = {
  members?: TeamMember[];
  onAddMember?: () => void;
};

const defaultMembers: TeamMember[] = [
  { id: 1, name: "Alexandra Deff", task: "Github Project Repository", status: "completed", avatar: "AD" },
  { id: 2, name: "Edwin Adenike", task: "Integrate User Authentication System", status: "in_progress", avatar: "EA" },
  { id: 3, name: "Isaac Oluwatemilorun", task: "Develop Search and Filter Functionality", status: "pending", avatar: "IO" },
  { id: 4, name: "David Oshodi", task: "Responsive Layout for Homepage", status: "in_progress", avatar: "DO" },
];

const statusStyles = {
  completed: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  in_progress: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  pending: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

const statusLabels = {
  completed: "Completed",
  in_progress: "In Progress",
  pending: "Pending",
};

const avatarColors = [
  "bg-pink-200 text-pink-700",
  "bg-orange-200 text-orange-700",
  "bg-cyan-200 text-cyan-700",
  "bg-purple-200 text-purple-700",
];

export function TeamActivity({ members = defaultMembers, onAddMember }: TeamActivityProps) {
  return (
    <div className="rounded-2xl bg-white p-6 dark:bg-neutral-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Team Collaboration</h3>
        {onAddMember && (
          <button
            type="button"
            onClick={onAddMember}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Member
          </button>
        )}
      </div>

      <div className="space-y-3">
        {members.map((member, index) => (
          <div
            key={member.id}
            className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
          >
            <div
              className={`flex size-10 items-center justify-center rounded-full text-sm font-semibold ${avatarColors[index % avatarColors.length]}`}
            >
              {member.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 dark:text-white">{member.name}</p>
              <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                Working on <span className="font-medium">{member.task}</span>
              </p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[member.status]}`}>
              {statusLabels[member.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
