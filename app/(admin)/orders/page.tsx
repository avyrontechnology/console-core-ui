"use client";

import Link from "next/link";
import { useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { OrderHistoryTable } from "@/features/orders/components/OrderHistoryTable";
import { useOrderHistory } from "@/features/orders/hooks";

function OrdersContent() {
  const [status, setStatus] = useState<string>("");
  const [manual, setManual] = useState<string>("");
  const { data, isLoading, error } = useOrderHistory({
    limit: 20,
    offset: 1,
    status: status || undefined,
    is_manually_created: manual === "" ? undefined : manual === "yes",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Orders</h1>
        <div className="flex gap-2">
          <Link href="/orders/validate" className="rounded border px-4 py-2">
            Validate payment
          </Link>
          <Link href="/orders/new" className="rounded bg-black px-4 py-2 text-white">
            New manual order
          </Link>
        </div>
      </div>
      <div className="flex gap-2">
        <select
          aria-label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded border px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="SUCCESS">SUCCESS</option>
          <option value="FAILED">FAILED</option>
          <option value="REFUNDED">REFUNDED</option>
        </select>
        <select
          aria-label="Origin"
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          className="rounded border px-3 py-2 text-sm"
        >
          <option value="">All origins</option>
          <option value="yes">Manual</option>
          <option value="no">Self-serve</option>
        </select>
      </div>
      {isLoading && <p>Loading…</p>}
      {error && <p className="text-sm text-critical">{error}</p>}
      {!isLoading && !error && (
        <>
          <p className="text-sm text-slate-500">Total: {data?.total_count ?? 0}</p>
          <OrderHistoryTable orders={data?.data ?? []} />
        </>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute requiredPermission="console:get_order_history">
      <OrdersContent />
    </ProtectedRoute>
  );
}
