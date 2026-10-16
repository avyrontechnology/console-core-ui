"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { TextField } from "@/components/ui/TextField";
import { validateOrderSchema } from "@/features/orders/validate-schema";

type ValidateInput = z.input<typeof validateOrderSchema>;

export function ValidateOrderForm({
  onSubmit,
  isSaving,
  serverError,
}: {
  onSubmit: (values: { order_id: string; payment_id: string; signature: string }) => Promise<void>;
  isSaving: boolean;
  serverError: string | null;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidateInput>({ resolver: zodResolver(validateOrderSchema) });

  return (
    <form onSubmit={handleSubmit((v) => onSubmit(v))} className="max-w-lg space-y-4">
      <TextField
        label="Gateway order id"
        error={errors.order_id?.message}
        {...register("order_id")}
      />
      <TextField
        label="Payment id"
        error={errors.payment_id?.message}
        {...register("payment_id")}
      />
      <TextField label="Signature" error={errors.signature?.message} {...register("signature")} />
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button
        type="submit"
        disabled={isSaving}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isSaving ? "Validating…" : "Validate payment"}
      </button>
    </form>
  );
}
