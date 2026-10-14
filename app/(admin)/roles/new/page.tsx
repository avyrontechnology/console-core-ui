"use client";

import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { RoleForm } from "@/features/rbac/components/RoleForm";
import { useCreateRole } from "@/features/rbac/hooks";

function NewRoleContent() {
  const router = useRouter();
  const { create, isSaving, error } = useCreateRole();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New role</h1>
      <RoleForm
        isSaving={isSaving}
        serverError={error}
        onSubmit={async (values) => {
          await create(values);
          router.push("/roles");
        }}
      />
    </div>
  );
}

export default function NewRolePage() {
  return (
    <ProtectedRoute requiredPermission="console:create_role">
      <NewRoleContent />
    </ProtectedRoute>
  );
}
