"use client";

import type { Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import type { User } from "@/types/user";

export const userColumns: Column<User>[] = [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "phone_number", header: "Phone" },
  {
    key: "is_active",
    header: "Status",
    render: (row) => (
      <Badge tone={row.is_active ? "positive" : "neutral"}>
        {row.is_active ? "Active" : "Inactive"}
      </Badge>
    ),
  },
];

export function UserTable({ users, onSelect }: { users: User[]; onSelect?: (user: User) => void }) {
  const columns: Column<User>[] = onSelect
    ? [
        ...userColumns,
        {
          key: "actions",
          header: "",
          render: (row) => (
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={() => onSelect(row)}
            >
              View
            </button>
          ),
        },
      ]
    : userColumns;
  return <DataTable columns={columns} rows={users} emptyText="No users found" />;
}
