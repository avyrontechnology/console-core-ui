"use client";

import type { Column } from "@/components/ui/DataTable";
import { DataTable } from "@/components/ui/DataTable";
import type { Partner } from "@/types/partner";

export const partnerColumns: Column<Partner>[] = [
  { key: "name", header: "Name" },
  { key: "company_legal_name", header: "Legal name" },
  { key: "gst_no", header: "GST" },
  {
    key: "is_active",
    header: "Status",
    render: (row) => (row.is_active ? "Active" : "Inactive"),
  },
];

export function PartnerTable({
  partners,
  onSelect,
}: {
  partners: Partner[];
  onSelect?: (partner: Partner) => void;
}) {
  const columns: Column<Partner>[] = onSelect
    ? [
        ...partnerColumns,
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
    : partnerColumns;
  return <DataTable columns={columns} rows={partners} emptyText="No partners found" />;
}
