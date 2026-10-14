"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { PlanTable } from "@/features/plans/components/PlanTable";
import { usePlans } from "@/features/plans/hooks";

function PlansContent() {
  const router = useRouter();
  const { data: plans, isLoading, error } = usePlans();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Plans</h1>
        <div className="flex gap-2">
          <Link href="/plans/modules" className="rounded border px-4 py-2">
            Modules
          </Link>
          <Link href="/plans/new" className="rounded bg-black px-4 py-2 text-white">
            New plan
          </Link>
        </div>
      </div>
      {isLoading && <p>Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!isLoading && !error && (
        <PlanTable plans={plans ?? []} onSelect={(plan) => router.push(`/plans/${plan.id}`)} />
      )}
    </div>
  );
}

export default function PlansPage() {
  return (
    <ProtectedRoute requiredPermission="console:get_active_plans">
      <PlansContent />
    </ProtectedRoute>
  );
}
