"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { PaymentHistoryTable } from "@/features/payments/components/PaymentHistoryTable";
import { usePaymentHistory } from "@/features/payments/hooks";

function PaymentsContent() {
  const { data, isLoading, error } = usePaymentHistory(20, 1);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Payments</h1>
      {isLoading && <p>Loading…</p>}
      {error && <p className="text-sm text-critical">{error}</p>}
      {!isLoading && !error && (
        <>
          <p className="text-sm text-slate-500">Total: {data?.total_count ?? 0}</p>
          <PaymentHistoryTable rows={data?.data ?? []} />
        </>
      )}
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <ProtectedRoute requiredPermission="console:get_payment_history">
      <PaymentsContent />
    </ProtectedRoute>
  );
}
