"use client";

import { usePermissions } from "@/hooks/usePermissions";

function Loading() {
  return (
    <div className="space-y-4" role="status" aria-busy="true" aria-label="Loading">
      <div className="h-7 w-40 animate-pulse rounded-md bg-slate-200" />
      <div className="h-64 animate-pulse rounded-lg border border-line bg-surface" />
    </div>
  );
}

function AccessDenied() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-lg font-medium">Access forbidden: insufficient permissions</p>
    </main>
  );
}

/** Gate content on a backend permission slug (e.g. "console:get_all_users"). */
export default function ProtectedRoute({
  requiredPermission,
  children,
}: {
  requiredPermission: string;
  children: React.ReactNode;
}) {
  const { isLoading, hasPermission } = usePermissions();

  if (isLoading) return <Loading />;
  if (!hasPermission(requiredPermission)) return <AccessDenied />;
  return <>{children}</>;
}
