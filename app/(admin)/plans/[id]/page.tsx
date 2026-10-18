"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useDeletePlan, usePlan } from "@/features/plans/hooks";

function PlanDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const { data: plan, isLoading, error } = usePlan(id);
  const { remove, isSaving: isDeleting } = useDeletePlan();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (isLoading) return <p>Loading…</p>;
  if (error || !plan) return <p className="text-sm text-critical">{error ?? "Plan not found"}</p>;

  const destroy = async () => {
    await remove(plan.id);
    router.push("/plans");
  };

  return (
    <div className="max-w-lg space-y-4">
      <Link href="/plans" className="text-sm text-blue-600 hover:underline">
        ← Plans
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{plan.name}</h1>
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          className="rounded border border-red-600 px-4 py-2 text-critical"
        >
          Delete
        </button>
      </div>
      <dl className="space-y-1 text-sm">
        <div className="flex gap-2">
          <dt className="w-32 text-slate-500">Price</dt>
          <dd>
            {plan.price ?? "—"} {plan.currency}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-32 text-slate-500">Duration</dt>
          <dd>{plan.duration} days</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-32 text-slate-500">Status</dt>
          <dd>{plan.is_active ? "Active" : "Inactive"}</dd>
        </div>
      </dl>
      <div>
        <h2 className="mb-1 text-sm font-medium">Modules</h2>
        {plan.modules.length === 0 ? (
          <p className="text-sm text-slate-500">None</p>
        ) : (
          <ul className="list-disc pl-5 text-sm">
            {plan.modules.map((mod) => (
              <li key={mod} className="font-mono text-xs">
                {mod}
              </li>
            ))}
          </ul>
        )}
      </div>
      {confirmDelete && (
        <ConfirmDialog
          title="Delete plan"
          message={`Delete ${plan.name}?`}
          confirmLabel="Delete"
          isBusy={isDeleting}
          onConfirm={() => void destroy()}
          onClose={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}

export default function PlanDetailPage() {
  const params = useParams<{ id: string }>();
  return (
    <ProtectedRoute requiredPermission="console:get_plan_by_id">
      <PlanDetailContent id={params.id} />
    </ProtectedRoute>
  );
}
