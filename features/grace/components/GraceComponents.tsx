"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { TextField } from "@/components/ui/TextField";
import { grantGraceSchema } from "@/features/grace/schema";
import type { GraceStatus } from "@/types/grace";

type GraceInput = z.input<typeof grantGraceSchema>;

export function GrantGraceForm({
  onSubmit,
  isSaving,
  serverError,
}: {
  onSubmit: (values: { partner_id: string; granted_days: number; remark: string }) => Promise<void>;
  isSaving: boolean;
  serverError: string | null;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GraceInput>({ resolver: zodResolver(grantGraceSchema) });

  return (
    <form onSubmit={handleSubmit((v) => onSubmit(v))} className="max-w-lg space-y-4">
      <TextField
        label="Partner ID"
        error={errors.partner_id?.message}
        {...register("partner_id")}
      />
      <TextField
        label="Granted days"
        type="number"
        error={errors.granted_days?.message}
        {...register("granted_days")}
      />
      <TextField label="Remark" error={errors.remark?.message} {...register("remark")} />
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button
        type="submit"
        disabled={isSaving}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isSaving ? "Saving…" : "Grant grace"}
      </button>
    </form>
  );
}

export function GraceStatusCard({ status }: { status: GraceStatus }) {
  return (
    <div className="rounded border p-4">
      <p className="font-medium">
        {status.service_name}: {status.has_active_grace ? "Active grace" : "No active grace"}
      </p>
      <p className="text-sm text-gray-500">
        Used {status.total_attempts_used} · remaining {status.attempts_remaining} · consumed{" "}
        {status.total_consumed_days}d
      </p>
      {status.current_grace && (
        <p className="mt-1 text-sm">
          {new Date(status.current_grace.start_date).toLocaleDateString()} →{" "}
          {new Date(status.current_grace.end_date).toLocaleDateString()} (
          {status.current_grace.status})
        </p>
      )}
    </div>
  );
}
