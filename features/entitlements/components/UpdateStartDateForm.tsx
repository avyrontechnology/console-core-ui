"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { TextField } from "@/components/ui/TextField";
import { updateStartDateSchema } from "@/features/entitlements/schema";

type StartDateInput = z.input<typeof updateStartDateSchema>;

export function UpdateStartDateForm({
  onSubmit,
  isSaving,
  serverError,
}: {
  onSubmit: (values: { order_id: string; start_date: number }) => Promise<void>;
  isSaving: boolean;
  serverError: string | null;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StartDateInput>({ resolver: zodResolver(updateStartDateSchema) });

  return (
    <form onSubmit={handleSubmit((v) => onSubmit(v))} className="max-w-lg space-y-4">
      <TextField label="Order ID" error={errors.order_id?.message} {...register("order_id")} />
      <TextField
        label="Start date (13-digit ms)"
        type="number"
        error={errors.start_date?.message}
        {...register("start_date")}
      />
      <p className="text-xs text-gray-500">
        Fresh orders only. End date shifts by order duration automatically.
      </p>
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button
        type="submit"
        disabled={isSaving}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isSaving ? "Saving…" : "Update start date"}
      </button>
    </form>
  );
}
