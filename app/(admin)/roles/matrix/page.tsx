"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { PermissionMatrix } from "@/features/rbac/components/PermissionMatrix";
import { usePermissionMatrix } from "@/features/rbac/hooks";

function MatrixContent() {
  const { data, isLoading, error, refresh } = usePermissionMatrix();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Permission matrix</h1>
        <button
          type="button"
          onClick={() => void refresh()}
          className="rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>
      {isLoading && <p>Loading…</p>}
      {error && <p className="text-sm text-critical">{error}</p>}
      {!isLoading && !error && data && (
        <PermissionMatrix
          matrix={data.default_role_permission}
          grants={{}}
          onToggle={() => undefined}
          disabled
        />
      )}
    </div>
  );
}

export default function MatrixPage() {
  return (
    <ProtectedRoute requiredPermission="console:get_default_role_permission_matrix">
      <MatrixContent />
    </ProtectedRoute>
  );
}
