"use client";

import { Badge, type Tone } from "@/components/ui/Badge";
import type { AuditLog } from "@/types/audit-log";

const ACTION_TONES: Record<string, Tone> = {
  CREATE: "positive",
  UPDATE: "caution",
  DELETE: "critical",
  DENY: "critical",
  GRANT: "info",
  REVOKE: "info",
};

function actionTone(action: string): Tone {
  return ACTION_TONES[action.toUpperCase()] ?? "neutral";
}

function formatTime(epochMs?: number | null): string {
  if (!epochMs) return "—";
  return new Date(epochMs).toLocaleString();
}

export function AuditLogTable({ logs }: { logs: AuditLog[] }) {
  if (logs.length === 0) {
    return <p className="text-sm text-slate-500">No audit logs found</p>;
  }

  return (
    <div className="overflow-x-auto rounded border">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left">
          <tr>
            <th className="px-3 py-2 font-medium">Time</th>
            <th className="px-3 py-2 font-medium">Action</th>
            <th className="px-3 py-2 font-medium">Resource</th>
            <th className="px-3 py-2 font-medium">Resource ID</th>
            <th className="px-3 py-2 font-medium">Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-t">
              <td className="whitespace-nowrap px-3 py-2">{formatTime(log.created_at)}</td>
              <td className="px-3 py-2">
                <Badge tone={actionTone(log.action)}>{log.action}</Badge>
              </td>
              <td className="px-3 py-2">{log.resource}</td>
              <td className="max-w-xs truncate px-3 py-2 font-mono text-xs">
                {log.resource_id ?? "—"}
              </td>
              <td className="max-w-md truncate px-3 py-2">{log.details ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
