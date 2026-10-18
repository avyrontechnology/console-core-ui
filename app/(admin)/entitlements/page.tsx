"use client";

import { useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { UpdateStartDateForm } from "@/features/entitlements/components/UpdateStartDateForm";
import { useUpdateStartDate } from "@/features/entitlements/hooks";
import type { UpdatedEntitlement } from "@/types/entitlement";

function EntitlementsContent() {
  const { update, isSaving, error } = useUpdateStartDate();
  const [updated, setUpdated] = useState<UpdatedEntitlement[] | null>(null);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Entitlements</h1>
      <p className="text-sm text-slate-500">
        Reschedule a fresh entitlement. All services of the order move together.
      </p>
      <UpdateStartDateForm
        isSaving={isSaving}
        serverError={error}
        onSubmit={async (values) => {
          const result = await update(values);
          setUpdated(result);
        }}
      />
      {updated && (
        <div className="rounded border p-4 text-sm">
          <p className="font-medium">Updated {updated.length} entitlement(s)</p>
          {updated.map((e) => (
            <p key={e.id}>
              {e.service_name}: {new Date(e.start_date).toLocaleDateString()} →{" "}
              {new Date(e.end_date).toLocaleDateString()}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EntitlementsPage() {
  return (
    <ProtectedRoute requiredPermission="console:update_entitlement_start_date">
      <EntitlementsContent />
    </ProtectedRoute>
  );
}
