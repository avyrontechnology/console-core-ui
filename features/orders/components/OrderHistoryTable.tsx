"use client";

import type { OrderHistoryItem } from "@/types/order";

function formatDate(ms?: number | null): string {
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString();
}

export function OrderHistoryTable({ orders }: { orders: OrderHistoryItem[] }) {
  if (orders.length === 0) {
    return <p className="py-8 text-center text-slate-500">No orders found</p>;
  }

  return (
    <div className="overflow-x-auto rounded border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b bg-slate-50">
            <th className="px-4 py-2 font-medium">Partner</th>
            <th className="px-4 py-2 font-medium">Plan</th>
            <th className="px-4 py-2 font-medium">Amount</th>
            <th className="px-4 py-2 font-medium">Status</th>
            <th className="px-4 py-2 font-medium">Type</th>
            <th className="px-4 py-2 font-medium">Manual</th>
            <th className="px-4 py-2 font-medium">Entitlement</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.order_id} className="border-b last:border-0 hover:bg-slate-50">
              <td className="px-4 py-2">{o.partner_name ?? o.partner_id ?? "—"}</td>
              <td className="px-4 py-2">{o.plan_name ?? "—"}</td>
              <td className="px-4 py-2">
                {o.total_price} {o.order_currency}
              </td>
              <td className="px-4 py-2">{o.order_status}</td>
              <td className="px-4 py-2">{o.order_type}</td>
              <td className="px-4 py-2">{o.is_manually_created ? "Yes" : "No"}</td>
              <td className="px-4 py-2">
                {formatDate(o.entitlement_start_date)} → {formatDate(o.entitlement_end_date)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
