"use client";

import { useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import {
  PartnerMetaForm,
  PartnerMetaSection,
} from "@/features/partner-meta/components/PartnerMetaComponents";
import { usePartnerMeta, useSavePartnerMeta } from "@/features/partner-meta/hooks";
import { usePartners } from "@/features/partners/hooks";

function PartnerMetaContent() {
  const [partnerId, setPartnerId] = useState("");
  const { partners } = usePartners();
  const { data: meta, isLoading, error } = usePartnerMeta(partnerId || null);
  const { save, isSaving, error: saveError } = useSavePartnerMeta();

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold">Partner meta</h1>
      <div>
        <label htmlFor="partner" className="mb-1 block text-sm font-medium">
          Partner
        </label>
        <select
          id="partner"
          className="w-full rounded border px-3 py-2"
          value={partnerId}
          onChange={(event) => setPartnerId(event.target.value)}
        >
          <option value="">Select a partner</option>
          {partners.map((partner) => (
            <option key={partner.id} value={partner.id}>
              {partner.name}
            </option>
          ))}
        </select>
      </div>
      {partnerId === "" && (
        <p className="text-sm text-gray-500">Select a partner to view or edit business meta.</p>
      )}
      {partnerId !== "" && isLoading && <p>Loading…</p>}
      {partnerId !== "" && error && <p className="text-sm text-red-600">{error}</p>}
      {partnerId !== "" && !isLoading && !error && (
        <>
          <PartnerMetaSection partnerId={partnerId} meta={meta} />
          <PartnerMetaForm
            initial={meta}
            isSaving={isSaving}
            serverError={saveError}
            onSubmit={async (values) => {
              await save(partnerId, values, meta !== null);
            }}
          />
        </>
      )}
    </div>
  );
}

export default function PartnerMetaPage() {
  return (
    <ProtectedRoute requiredPermission="console:get_partner_meta_data">
      <PartnerMetaContent />
    </ProtectedRoute>
  );
}
