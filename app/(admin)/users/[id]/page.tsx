"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { ConfirmDialog } from "@/components/ui/Modal";
import { TextField } from "@/components/ui/TextField";
import { useDeleteUser, useUpdateUser, useUser } from "@/features/users/hooks";

function UserDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const { data: user, isLoading, error } = useUser(id);
  const { update, isSaving, error: saveError } = useUpdateUser();
  const { remove, isSaving: isDeleting } = useDeleteUser();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [designation, setDesignation] = useState<string | null>(null);

  if (isLoading) return <p>Loading…</p>;
  if (error || !user) return <p className="text-sm text-critical">{error ?? "User not found"}</p>;

  const save = async () => {
    await update(user.id, {
      ...(name !== null ? { name } : {}),
      ...(designation !== null ? { designation } : {}),
    });
    router.push("/users");
  };

  const destroy = async () => {
    await remove(user.id);
    router.push("/users");
  };

  return (
    <div className="max-w-lg space-y-4">
      <Link href="/users" className="text-sm text-blue-600 hover:underline">
        ← Users
      </Link>
      <h1 className="text-xl font-semibold">{user.name}</h1>
      <dl className="space-y-1 text-sm">
        <div className="flex gap-2">
          <dt className="w-28 text-slate-500">Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-28 text-slate-500">Phone</dt>
          <dd>{user.phone_number}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-28 text-slate-500">Status</dt>
          <dd>{user.is_active ? "Active" : "Inactive"}</dd>
        </div>
      </dl>
      <TextField
        label="Name"
        name="name"
        defaultValue={user.name}
        onChange={(event) => setName(event.target.value)}
      />
      <TextField
        label="Designation"
        name="designation"
        defaultValue={user.designation ?? ""}
        onChange={(event) => setDesignation(event.target.value)}
      />
      {saveError && <p className="text-sm text-critical">{saveError}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => void save()}
          disabled={isSaving}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {isSaving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          className="rounded border border-red-600 px-4 py-2 text-critical"
        >
          Delete
        </button>
      </div>
      {confirmDelete && (
        <ConfirmDialog
          title="Delete user"
          message={`Delete ${user.name} (${user.email})?`}
          confirmLabel="Delete"
          isBusy={isDeleting}
          onConfirm={() => void destroy()}
          onClose={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  return (
    <ProtectedRoute requiredPermission="console:get_user_by_user_id">
      <UserDetailContent id={params.id} />
    </ProtectedRoute>
  );
}
