"use client";

import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { PartnerForm } from "@/features/partners/components/PartnerForm";
import { useCreatePartner } from "@/features/partners/hooks";

function NewPartnerContent() {
  const router = useRouter();
  const { create, isSaving, error } = useCreatePartner();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New partner</h1>
      <PartnerForm
        isSaving={isSaving}
        serverError={error}
        onSubmit={async (values) => {
          await create(values);
          router.push("/partners");
        }}
      />
    </div>
  );
}

export default function NewPartnerPage() {
  return (
    <ProtectedRoute requiredPermission="console:add_partner">
      <NewPartnerContent />
    </ProtectedRoute>
  );
}
