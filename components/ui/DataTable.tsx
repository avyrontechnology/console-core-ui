import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
}

/** Single generic table for every list screen. Columns via defs, not files. */
export function DataTable<T extends { id: string }>({
  columns,
  rows,
  emptyText = "No records found",
}: {
  columns: Column<T>[];
  rows: T[];
  emptyText?: string;
}) {
  if (rows.length === 0) {
    return <p className="py-8 text-center text-gray-500">{emptyText}</p>;
  }
  return (
    <div className="overflow-x-auto rounded border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-2 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b last:border-0 hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2">
                  {col.render
                    ? col.render(row)
                    : String((row as unknown as Record<string, unknown>)[col.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
