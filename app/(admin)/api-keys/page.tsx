"use client";

import { useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useApiKey, useInactivateKey, useRotateKey, useUpdateKey } from "@/features/api-keys/hooks";

function maskKey(key: string): string {
  if (key.length <= 8) return "••••";
  return `${key.slice(0, 4)}…${key.slice(-4)}`;
}

function ApiKeyContent() {
  const { data: key, isLoading, error, refresh } = useApiKey();
  const { rotate, isSaving: isRotating, error: rotateError } = useRotateKey();
  const { update, isSaving: isUpdating } = useUpdateKey();
  const { inactivate, isSaving: isDeactivating } = useInactivateKey();
  const [revealed, setRevealed] = useState(false);
  const [confirmRotate, setConfirmRotate] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const [scopesText, setScopesText] = useState<string | null>(null);

  if (isLoading) return <p>Loading…</p>;
  if (error || !key) return <p className="text-sm text-critical">{error ?? "No API key found"}</p>;

  const doRotate = async () => {
    await rotate();
    setConfirmRotate(false);
    setRevealed(true);
    await refresh();
  };

  const doDeactivate = async () => {
    await inactivate();
    setConfirmDeactivate(false);
    await refresh();
  };

  const saveScopes = async () => {
    const scopes = (scopesText ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    await update({ scopes });
    await refresh();
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold">API key</h1>
      <div className="rounded border p-4">
        <div className="flex items-center justify-between gap-4">
          <code className="font-mono text-sm">{revealed ? key.key : maskKey(key.key)}</code>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRevealed((v) => !v)}
              className="rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              {revealed ? "Hide" : "Reveal"}
            </button>
            <button
              type="button"
              onClick={() => void navigator.clipboard.writeText(key.key)}
              className="rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              Copy
            </button>
          </div>
        </div>
        <dl className="mt-3 space-y-1 text-sm">
          <div className="flex gap-2">
            <dt className="w-28 text-slate-500">Status</dt>
            <dd>{key.is_active ? "Active" : "Inactive"}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-28 text-slate-500">Expires</dt>
            <dd>{key.expires_at ? new Date(key.expires_at).toLocaleString() : "Never"}</dd>
          </div>
        </dl>
      </div>
      <div className="rounded border p-4">
        <h2 className="mb-2 font-medium">Scopes (one per line, empty = deny-all)</h2>
        <textarea
          rows={4}
          className="w-full rounded border px-3 py-2 font-mono text-xs"
          defaultValue={(key.scopes ?? []).join("\n")}
          onChange={(event) => setScopesText(event.target.value)}
        />
        <button
          type="button"
          onClick={() => void saveScopes()}
          disabled={isUpdating || scopesText === null}
          className="mt-2 rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {isUpdating ? "Saving…" : "Save scopes"}
        </button>
      </div>
      {rotateError && <p className="text-sm text-critical">{rotateError}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setConfirmRotate(true)}
          className="rounded border px-4 py-2"
        >
          Rotate key
        </button>
        <button
          type="button"
          onClick={() => setConfirmDeactivate(true)}
          disabled={!key.is_active}
          className="rounded border border-red-600 px-4 py-2 text-critical disabled:opacity-50"
        >
          Deactivate
        </button>
      </div>
      {confirmRotate && (
        <ConfirmDialog
          title="Rotate API key"
          message="This invalidates the current key immediately. Clients using it will break until updated."
          confirmLabel="Rotate"
          isBusy={isRotating}
          onConfirm={() => void doRotate()}
          onClose={() => setConfirmRotate(false)}
        />
      )}
      {confirmDeactivate && (
        <ConfirmDialog
          title="Deactivate API key"
          message="This disables the current key immediately."
          confirmLabel="Deactivate"
          isBusy={isDeactivating}
          onConfirm={() => void doDeactivate()}
          onClose={() => setConfirmDeactivate(false)}
        />
      )}
    </div>
  );
}

export default function ApiKeysPage() {
  return (
    <ProtectedRoute requiredPermission="console:get_api_key">
      <ApiKeyContent />
    </ProtectedRoute>
  );
}
