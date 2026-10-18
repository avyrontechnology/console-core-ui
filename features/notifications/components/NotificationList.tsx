"use client";

import type { Notification } from "@/types/notification";

function formatTime(epochMs?: number | null): string {
  if (!epochMs) return "—";
  return new Date(epochMs).toLocaleString();
}

export function NotificationList({ notifications }: { notifications: Notification[] }) {
  if (notifications.length === 0) {
    return <p className="text-sm text-slate-500">No notifications</p>;
  }

  return (
    <ul className="divide-y rounded border">
      {notifications.map((n) => (
        <li key={n.id} className="flex items-start gap-3 px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className={`text-sm ${n.is_read ? "text-slate-500" : "font-semibold text-slate-900"}`}
              >
                {n.title}
              </p>
              <p className="text-sm text-slate-600">{n.body}</p>
            </div>
            <span className="whitespace-nowrap text-xs text-slate-400">
              {formatTime(n.created_at)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
