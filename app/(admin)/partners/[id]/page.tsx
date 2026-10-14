"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { ConfirmDialog } from "@/components/ui/Modal";
import { TextField } from "@/components/ui/TextField";
import {
  useDeletePartner,
  usePartner,
  useTogglePartnerActivation,
  useUpdatePartner,
} from "@/features/partners/hooks";

function PartnerDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const { data: partner, isLoading, error } = usePartner(id);
  const { update, isSaving, error: saveError } = useUpdatePartner();
  const { remove, isSaving: isDeleting } = useDeletePartner();
  const { toggle, isSaving: isToggling } = useTogglePartnerActivation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);

  if (isLoading) return <p>Loading…</p>;
  if (error || !partner)
    return <p className="text-sm text-red-600">{error ?? "Partner not found"}</p>;

  const save = async () => {
    await update(partner.id, {
      ...(name !== null ? { name } : {}),
      ...(description !== null ? { description } : {}),
    });
    router.push("/partners");
  };

  const destroy = async () => {
    await remove(partner.id);
    router.push("/partners");
  };

  const flipActivation = async () => {
    await toggle(partner.id, !partner.is_active);
    router.push("/partners");
  };

  return (
    <div className="max-w-lg space-y-4">
      <Link href="/partners" className="text-sm text-blue-600 hover:underline">
        ← Partners
      </Link>
      <h1 className="text-xl font-semibold">{partner.name}</h1>
      <dl className="space-y-1 text-sm">
        <div className="flex gap-2">
          <dt className="w-32 text-gray-500">Legal name</dt>
          <dd>{partner.company_legal_name}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-32 text-gray-500">Status</dt>
          <dd>{partner.is_active ? "Active" : "Inactive"}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-32 text-gray-500">Licenses</dt>
          <dd>{partner.active_license ?? "—"}</dd>
        </div>
      </dl>
      <TextField
        label="Name"
        name="name"
        defaultValue={partner.name}
        onChange={(event) => setName(event.target.value)}
      />
      <TextField
        label="Description"
        name="description"
        defaultValue={partner.description ?? ""}
        onChange={(event) => setDescription(event.target.value)}
      />
      {saveError && <p className="text-sm text-red-600">{saveError}</p>}
      <div className="flex flex-wrap gap-2">
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
          onClick={() => void flipActivation()}
          disabled={isToggling}
          className="rounded border px-4 py-2 disabled:opacity-50"
        >
          {partner.is_active ? "Deactivate" : "Activate"}
        </button>
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          className="rounded border border-red-600 px-4 py-2 text-red-600"
        >
          Delete
        </button>
      </div>
      {confirmDelete && (
        <ConfirmDialog
          title="Delete partner"
          message={`Delete ${partner.name}?`}
          confirmLabel="Delete"
          isBusy={isDeleting}
          onConfirm={() => void destroy()}
          onClose={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}

export default function PartnerDetailPage() {
  const params = useParams<{ id: string }>();
  return (
    <ProtectedRoute requiredPermission="console:get_partners_by_id">
      <PartnerDetailContent id={params.id} />
    </ProtectedRoute>
  );
}
