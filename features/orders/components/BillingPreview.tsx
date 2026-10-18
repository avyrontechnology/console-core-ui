"use client";

import { useEffect, useState } from "react";

import { ordersApi } from "@/features/orders/api";

function summaryTotal(billing: Record<string, unknown> | null): string {
  if (!billing) return "—";
  const summary = billing["summary"] as Record<string, unknown> | undefined;
  const total = summary?.["total_payable"] ?? billing["total_payable"];
  return total == null ? "—" : String(total);
}

export function BillingPreview({ planId }: { planId: string }) {
  const [billing, setBilling] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!planId) {
      setBilling(null);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    ordersApi
      .billingDetails({ plan_id: planId })
      .then((data) => {
        if (!cancelled) {
          setBilling(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setBilling(null);
          setIsLoading(false);
          setError(err instanceof Error ? err.message : "Billing failed");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [planId]);

  if (!planId) return null;
  if (isLoading) return <p className="text-sm text-slate-500">Calculating billing…</p>;
  if (error) return <p className="text-sm text-critical">{error}</p>;
  if (!billing) return null;

  return (
    <div className="rounded border p-4 text-sm">
      <p className="font-medium">Billing preview</p>
      <p className="mt-1">Total payable: {summaryTotal(billing)}</p>
    </div>
  );
}
