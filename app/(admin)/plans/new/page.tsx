"use client";

import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { PlanForm } from "@/features/plans/components/PlanForm";
import { useCreatePlan, usePlanModules } from "@/features/plans/hooks";

function NewPlanContent() {
  const router = useRouter();
  const { create, isSaving, error } = useCreatePlan();
  const { data: modules } = usePlanModules();
  const availableModules = Array.from(
    new Set(
      Object.values(modules ?? {})
        .flat()
        .filter((m): m is string => typeof m === "string"),
    ),
  ).sort();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New plan</h1>
      <PlanForm
        availableModules={availableModules}
        isSaving={isSaving}
        serverError={error}
        onSubmit={async (values) => {
          await create(values);
          router.push("/plans");
        }}
      />
    </div>
  );
}

export default function NewPlanPage() {
  return (
    <ProtectedRoute requiredPermission="console:create_plan">
      <NewPlanContent />
    </ProtectedRoute>
  );
}
