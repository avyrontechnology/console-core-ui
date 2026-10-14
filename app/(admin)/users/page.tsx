"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useUsers } from "@/features/users/hooks";
import { UserTable } from "@/features/users/components/UserTable";

const PAGE_SIZE = 20;

function UsersContent() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const {
    data: users,
    isLoading,
    error,
  } = useUsers({
    offset: page * PAGE_SIZE,
    limit: PAGE_SIZE,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Users</h1>
        <Link href="/users/new" className="rounded bg-black px-4 py-2 text-white">
          New user
        </Link>
      </div>
      {isLoading && <p>Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!isLoading && !error && (
        <UserTable users={users ?? []} onSelect={(user) => router.push(`/users/${user.id}`)} />
      )}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          className="rounded border px-3 py-1"
        >
          Next
        </button>
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
