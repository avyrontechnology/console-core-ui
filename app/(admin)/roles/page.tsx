"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { RoleTable } from "@/features/rbac/components/RoleTable";
import { useRoles } from "@/features/rbac/hooks";

function RolesContent() {
  const router = useRouter();
  const { data: roles, isLoading, error } = useRoles();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Roles</h1>
        <div className="flex gap-2">
          <Link href="/roles/matrix" className="rounded border px-4 py-2">
            Permission matrix
          </Link>
          <Link href="/roles/new" className="rounded bg-black px-4 py-2 text-white">
            New role
          </Link>
        </div>
      </div>
      {isLoading && <p>Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!isLoading && !error && (
        <RoleTable roles={roles ?? []} onSelect={(role) => router.push(`/roles/${role.id}`)} />
      )}
    </div>
  );
}

export default function RolesPage() {
  return (
    <ProtectedRoute requiredPermission="console:get_roles">
      <RolesContent />
    </ProtectedRoute>
  );
}
