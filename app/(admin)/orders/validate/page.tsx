"use client";

import { useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { ValidateOrderForm } from "@/features/orders/components/ValidateOrderForm";
import { useValidateOrder } from "@/features/orders/hooks";

function ValidateContent() {
  const { validate, isSaving, error } = useValidateOrder();
  const [done, setDone] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Validate payment</h1>
      <p className="text-sm text-gray-500">Terminal on SUCCESS/REFUNDED. FAILED stays retryable.</p>
      <ValidateOrderForm
        isSaving={isSaving}
        serverError={error}
        onSubmit={async (values) => {
          const result = await validate(values);
          setDone(JSON.stringify(result["status"] ?? result));
        }}
      />
      {done && <p className="text-sm text-green-700">Status: {done}</p>}
    </div>
  );
}

export default function ValidateOrderPage() {
  return (
    <ProtectedRoute requiredPermission="console:validate_order">
      <ValidateContent />
    </ProtectedRoute>
  );
}
