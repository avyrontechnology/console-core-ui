"use client";

import type { Column } from "@/components/ui/DataTable";
import { DataTable } from "@/components/ui/DataTable";
import type { Role } from "@/types/rbac";

export const roleColumns: Column<Role>[] = [
  { key: "name", header: "Name" },
  { key: "slug", header: "Slug" },
  { key: "hierarchy", header: "Hierarchy" },
  {
    key: "is_active",
    header: "Status",
    render: (row) => (row.is_active ? "Active" : "Inactive"),
  },
];

export function RoleTable({ roles, onSelect }: { roles: Role[]; onSelect?: (role: Role) => void }) {
  const columns: Column<Role>[] = onSelect
    ? [
        ...roleColumns,
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
    : roleColumns;
  return <DataTable columns={columns} rows={roles} emptyText="No roles found" />;
}
