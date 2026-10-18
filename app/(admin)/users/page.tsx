"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { useUsers } from "@/features/users/hooks";
import { UserTable } from "@/features/users/components/UserTable";

const PAGE_SIZE = 20;

function UsersContent() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const { users, totalCount, isLoading, error } = useUsers({
    offset: page * PAGE_SIZE + 1, // backend offset is 1-based
    limit: PAGE_SIZE,
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Users"
        description={`${totalCount} ${totalCount === 1 ? "user" : "users"} in this workspace`}
        actions={
          <Link
            href="/users/new"
            className="inline-flex items-center rounded-md border border-transparent bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            New user
          </Link>
        }
      />
      {isLoading && <p className="text-sm text-slate-500">Loading…</p>}
      {error && <p className="text-sm text-critical">{error}</p>}
      {!isLoading && !error && (
        <UserTable users={users} onSelect={(user) => router.push(`/users/${user.id}`)} />
      )}
      <div className="flex gap-2">
        <Button disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
          Previous
        </Button>
        <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
      </div>
    </div>
  );
}

export default function UsersPage() {
  return (
    <ProtectedRoute requiredPermission="console:get_all_users">
      <UsersContent />
    </ProtectedRoute>
  );
}
