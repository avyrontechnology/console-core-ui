"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { TextField } from "@/components/ui/TextField";
import { BillingPreview } from "@/features/orders/components/BillingPreview";
import { manualOrderSchema } from "@/features/orders/schema";

type ManualOrderInput = z.input<typeof manualOrderSchema>;

export function ManualOrderForm({
  onSubmit,
  isSaving,
  serverError,
}: {
  onSubmit: (values: {
    partner_id: string;
    plan_id: string;
    amount: number;
    payment_method: "GATEWAY" | "DIRECT";
    currency: string;
  }) => Promise<void>;
  isSaving: boolean;
  serverError: string | null;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ManualOrderInput>({
    resolver: zodResolver(manualOrderSchema),
    defaultValues: { currency: "INR", payment_method: "GATEWAY" },
  });
  const planId = watch("plan_id") ?? "";

  return (
    <form
      onSubmit={handleSubmit((v) => onSubmit({ ...v, currency: v.currency ?? "INR" }))}
      className="max-w-lg space-y-4"
    >
      <TextField
        label="Partner ID"
        error={errors.partner_id?.message}
        {...register("partner_id")}
      />
      <TextField label="Plan ID" error={errors.plan_id?.message} {...register("plan_id")} />
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Amount"
          type="number"
          error={errors.amount?.message}
          {...register("amount")}
        />
        <TextField label="Currency" error={errors.currency?.message} {...register("currency")} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Payment method</label>
        <select {...register("payment_method")} className="w-full rounded border px-3 py-2 text-sm">
          <option value="GATEWAY">GATEWAY (pay via gateway)</option>
          <option value="DIRECT">DIRECT (provision immediately)</option>
        </select>
        {errors.payment_method?.message && (
          <p className="mt-1 text-sm text-critical">{errors.payment_method.message}</p>
        )}
      </div>
      {serverError && <p className="text-sm text-critical">{serverError}</p>}
      <BillingPreview planId={planId} />
      <button
        type="submit"
        disabled={isSaving}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isSaving ? "Saving…" : "Create manual order"}
      </button>
    </form>
  );
}
