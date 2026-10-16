"use client";

function cell(value: unknown): string {
  if (value == null) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function PaymentHistoryTable({ rows }: { rows: Array<Record<string, unknown>> }) {
  if (rows.length === 0) {
    return <p className="py-8 text-center text-gray-500">No payments found</p>;
  }

  const sample = rows[0] ?? {};
  const columns = ["id", "status", "amount", "currency", "gateway"].filter(
    (c) => c in sample || rows.some((r) => c in r),
  );
  const cols = columns.length > 0 ? columns : Object.keys(sample).slice(0, 5);

  return (
    <div className="overflow-x-auto rounded border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            {cols.map((c) => (
              <th key={c} className="px-4 py-2 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={String(row["id"] ?? i)} className="border-b last:border-0 hover:bg-gray-50">
              {cols.map((c) => (
                <td key={c} className="px-4 py-2">
                  {cell(row[c])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
