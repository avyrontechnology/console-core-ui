"use client";

import { useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { AuditLogTable } from "@/features/audit-logs/components/AuditLogTable";
import { useAuditLogs } from "@/features/audit-logs/hooks";
import { AUDIT_ACTIONS, AUDIT_RESOURCES } from "@/types/audit-log";

function AuditLogsContent() {
  const [resource, setResource] = useState("");
  const [action, setAction] = useState("");
  const [applied, setApplied] = useState<{ resource?: string; action?: string }>({});
  const {
    data: logs,
    isLoading,
    error,
    refresh,
  } = useAuditLogs({
    ...applied,
    limit: 50,
  });

  const apply = async () => {
    setApplied({
      ...(resource ? { resource } : {}),
      ...(action ? { action } : {}),
    });
    await refresh();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Audit logs</h1>
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm">
          Resource
          <select
            aria-label="Resource"
            value={resource}
            onChange={(e) => setResource(e.target.value)}
            className="ml-2 rounded border px-2 py-1"
          >
            <option value="">All</option>
            {AUDIT_RESOURCES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Action
          <select
            aria-label="Action"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="ml-2 rounded border px-2 py-1"
          >
            <option value="">All</option>
            {AUDIT_ACTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={apply}
          className="rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        >
          Apply filters
        </button>
      </div>
      {isLoading && <p>Loading…</p>}
      {error && <p className="text-sm text-critical">{error}</p>}
      {!isLoading && !error && <AuditLogTable logs={logs ?? []} />}
    </div>
  );
}

export default function AuditLogsPage() {
  return (
    <ProtectedRoute requiredPermission="console:get_audit_logs">
      <AuditLogsContent />
    </ProtectedRoute>
  );
}
