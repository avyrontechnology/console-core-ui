"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { ConfirmDialog } from "@/components/ui/Modal";
import { PermissionMatrix } from "@/features/rbac/components/PermissionMatrix";
import {
  useDeleteRole,
  usePermissionMatrix,
  useRole,
  useSetRoleActionPermissions,
} from "@/features/rbac/hooks";

function RoleDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: role, isLoading, error } = useRole(id);
  const {
    data: matrixResponse,
    isLoading: isMatrixLoading,
    error: matrixError,
  } = usePermissionMatrix();
  const { remove, isSaving: isDeleting } = useDeleteRole();
  const { save, isSaving, error: saveError } = useSetRoleActionPermissions();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [grants, setGrants] = useState<Record<string, boolean>>({});

  if (isLoading) return <p>Loading…</p>;
  if (error || !role) return <p className="text-sm text-critical">{error ?? "Role not found"}</p>;

  const partnerId = session?.partnerInfo?.partner_id ?? "";
  const roleMatrix = matrixResponse
    ? { [role.name]: matrixResponse.default_role_permission[role.name] ?? {} }
    : {};

  const savePermissions = async () => {
    if (!partnerId) return;
    await save(id, partnerId, grants);
  };

  const destroy = async () => {
    await remove(role.id);
    router.push("/roles");
  };

  return (
    <div className="max-w-3xl space-y-4">
      <Link href="/roles" className="text-sm text-blue-600 hover:underline">
        ← Roles
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{role.name}</h1>
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          className="rounded border border-red-600 px-4 py-2 text-critical"
        >
          Delete
        </button>
      </div>
      <dl className="space-y-1 text-sm">
        <div className="flex gap-2">
          <dt className="w-28 text-slate-500">Slug</dt>
          <dd className="font-mono text-xs">{role.slug}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-28 text-slate-500">Hierarchy</dt>
          <dd>{role.hierarchy ?? "—"}</dd>
        </div>
      </dl>
      <h2 className="text-lg font-semibold">Permissions</h2>
      {isMatrixLoading && <p>Loading…</p>}
      {matrixError && <p className="text-sm text-critical">{matrixError}</p>}
      {!isMatrixLoading && !matrixError && (
        <PermissionMatrix
          matrix={roleMatrix}
          grants={grants}
          onToggle={(slug, granted) => setGrants((prev) => ({ ...prev, [slug]: granted }))}
          disabled={!partnerId || isSaving}
        />
      )}
      {saveError && <p className="text-sm text-critical">{saveError}</p>}
      {!partnerId && (
        <p className="text-sm text-slate-500">Partner context missing — toggles are disabled.</p>
      )}
      <button
        type="button"
        onClick={() => void savePermissions()}
        disabled={!partnerId || isSaving}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isSaving ? "Saving…" : "Save permissions"}
      </button>
      {confirmDelete && (
        <ConfirmDialog
          title="Delete role"
          message={`Delete ${role.name}?`}
          confirmLabel="Delete"
          isBusy={isDeleting}
          onConfirm={() => void destroy()}
          onClose={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}

export default function RoleDetailPage() {
  const params = useParams<{ id: string }>();
  return (
    <ProtectedRoute requiredPermission="console:get_role_by_id">
      <RoleDetailContent id={params.id} />
    </ProtectedRoute>
  );
}
