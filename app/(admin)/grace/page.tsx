"use client";

import { useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { GraceStatusCard, GrantGraceForm } from "@/features/grace/components/GraceComponents";
import { useGraceStatus, useGrantGrace } from "@/features/grace/hooks";

function GraceContent() {
  const [partnerId, setPartnerId] = useState("");
  const [lookup, setLookup] = useState<string | null>(null);
  const { data, isLoading, error, refresh } = useGraceStatus(lookup);
  const { grant, isSaving, error: grantError } = useGrantGrace();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Grace</h1>
      <p className="text-sm text-slate-500">
        Internal only. Services derive from the last SUCCESS order.
      </p>
      <div className="flex max-w-lg gap-2">
        <input
          aria-label="Partner ID"
          value={partnerId}
          onChange={(e) => setPartnerId(e.target.value)}
          placeholder="Partner ID"
          className="w-full rounded border px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => setLookup(partnerId || null)}
          className="rounded border px-4 py-2"
        >
          Check
        </button>
      </div>
      {isLoading && <p>Loading…</p>}
      {error && <p className="text-sm text-critical">{error}</p>}
      {!isLoading && !error && data && <GraceStatusCard status={data} />}
      <h2 className="font-medium">Grant grace</h2>
      <GrantGraceForm
        isSaving={isSaving}
        serverError={grantError}
        onSubmit={async (values) => {
          await grant(values);
          await refresh();
        }}
      />
    </div>
  );
}

export default function GracePage() {
  return (
    <ProtectedRoute requiredPermission="console:get_grace_status">
      <GraceContent />
    </ProtectedRoute>
  );
}
