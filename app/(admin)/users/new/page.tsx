"use client";

import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useCreateUser, useRoles } from "@/features/users/hooks";
import { UserForm } from "@/features/users/components/UserForm";

// NOTE: backend user creation rides the public signup endpoint, so there is
// no dedicated admin-create slug yet. Gate on user-listing until the backend
// adds one (tracked: console RBAC gap).
function NewUserContent() {
  const router = useRouter();
  const { data: roles } = useRoles();
  const { create, isSaving, error } = useCreateUser();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New user</h1>
      <UserForm
        roles={roles ?? []}
        isSaving={isSaving}
        serverError={error}
        onSubmit={async (values) => {
          await create(values);
          router.push("/users");
        }}
      />
    </div>
  );
}

export default function NewUserPage() {
  return (
    <ProtectedRoute requiredPermission="console:get_all_users">
      <NewUserContent />
    </ProtectedRoute>
  );
}
