"use client";

import { usePermissions } from "@/hooks/usePermissions";

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

  if (isLoading) return null;
  if (!hasPermission(requiredPermission)) return <AccessDenied />;
  return <>{children}</>;
}
