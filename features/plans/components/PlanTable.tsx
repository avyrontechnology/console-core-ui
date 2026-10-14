"use client";

import type { Column } from "@/components/ui/DataTable";
import { DataTable } from "@/components/ui/DataTable";
import type { Plan } from "@/types/plan";

export const planColumns: Column<Plan>[] = [
  { key: "name", header: "Name" },
  { key: "tag", header: "Tag" },
  {
    key: "price",
    header: "Price",
    render: (row) => (row.price == null ? "—" : `${row.price} ${row.currency}`),
  },
  { key: "duration", header: "Duration (days)" },
  {
    key: "is_active",
    header: "Status",
    render: (row) => (row.is_active ? "Active" : "Inactive"),
  },
];

export function PlanTable({ plans, onSelect }: { plans: Plan[]; onSelect?: (plan: Plan) => void }) {
  const columns: Column<Plan>[] = onSelect
    ? [
        ...planColumns,
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
    : planColumns;
  return <DataTable columns={columns} rows={plans} emptyText="No plans found" />;
}
