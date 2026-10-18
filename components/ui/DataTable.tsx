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
    return (
      <div className="rounded-lg border border-line bg-surface py-12 text-center text-sm text-slate-500 shadow-card">
        {emptyText}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-surface shadow-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-slate-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className="border-b border-line px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-line last:border-0 transition-colors hover:bg-brand-50/40"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2.5 text-slate-700">
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
