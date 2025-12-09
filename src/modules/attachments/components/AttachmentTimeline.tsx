"use client";

import type { AttachmentLog } from "@/services/api";
import { formatDateTime, formatAction } from "@/utils";

type AttachmentTimelineProps = {
  logs: AttachmentLog[];
};

export function AttachmentTimeline({ logs }: AttachmentTimelineProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">Document timeline</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-700">
              <th className="pb-3 text-left text-xs font-semibold text-neutral-900 dark:text-white">Member name</th>
              <th className="pb-3 text-left text-xs font-semibold text-neutral-900 dark:text-white">Role</th>
              <th className="pb-3 text-left text-xs font-semibold text-neutral-900 dark:text-white">Date & time</th>
              <th className="pb-3 text-left text-xs font-semibold text-neutral-900 dark:text-white">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                  No activity recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                        {log.user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-neutral-900 dark:text-white">{log.user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-neutral-500 dark:text-neutral-400">Administrator</td>
                  <td className="py-4 text-sm text-neutral-500 dark:text-neutral-400">{formatDateTime(log.createdAt)}</td>
                  <td className="py-4 text-sm text-neutral-500 dark:text-neutral-400">{formatAction(log.action)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
