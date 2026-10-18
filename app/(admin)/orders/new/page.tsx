"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { ManualOrderForm } from "@/features/orders/components/ManualOrderForm";
import { useCreateManualOrder } from "@/features/orders/hooks";

function NewOrderContent() {
  const router = useRouter();
  const { create, isSaving, error } = useCreateManualOrder();
  const [done, setDone] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New manual order</h1>
      <p className="text-sm text-slate-500">
        DIRECT provisions immediately. GATEWAY initiates payment first.
      </p>
      <ManualOrderForm
        isSaving={isSaving}
        serverError={error}
        onSubmit={async (values) => {
          const result = await create(values);
          const order = result.order as Record<string, unknown>;
          setDone(String(order["id"] ?? "created"));
          router.push("/orders");
        }}
      />
      {done && <p className="text-sm text-green-700">Order {done} created</p>}
    </div>
  );
}

export default function NewManualOrderPage() {
  return (
    <ProtectedRoute requiredPermission="console:create_manual_order">
      <NewOrderContent />
    </ProtectedRoute>
  );
}
