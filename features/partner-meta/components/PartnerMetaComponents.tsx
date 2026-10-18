"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { TextField } from "@/components/ui/TextField";
import { partnerMetaSchema } from "@/features/partner-meta/schema";
import type { PartnerMeta } from "@/types/partner-meta";

type MetaInput = z.input<typeof partnerMetaSchema>;

export function PartnerMetaSection({
  partnerId,
  meta,
}: {
  partnerId: string;
  meta: PartnerMeta | null;
}) {
  return (
    <div className="rounded border p-4 text-sm">
      <p className="mb-2 font-medium">Business meta</p>
      {!meta ? (
        <p className="text-slate-500">No meta yet — fill below to create.</p>
      ) : (
        <dl className="space-y-1">
          <div className="flex gap-2">
            <dt className="w-32 text-slate-500">Business</dt>
            <dd>{meta.type_of_business?.trim() || "—"}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-32 text-slate-500">Years</dt>
            <dd>{meta.years_in_business ?? "—"}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-32 text-slate-500">Revenue</dt>
            <dd>{meta.annual_revenue ?? "—"}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-32 text-slate-500">Talko</dt>
            <dd>{meta.is_talko_enabled ? "Enabled" : "Disabled"}</dd>
          </div>
        </dl>
      )}
      <p className="mt-2 text-xs text-slate-400">Partner: {partnerId}</p>
    </div>
  );
}

export function PartnerMetaForm({
  initial,
  onSubmit,
  isSaving,
  serverError,
}: {
  initial?: PartnerMeta | null;
  onSubmit: (values: {
    type_of_business?: string;
    years_in_business?: number;
    annual_revenue?: number;
    is_talko_enabled?: boolean;
  }) => Promise<void>;
  isSaving: boolean;
  serverError: string | null;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MetaInput>({ resolver: zodResolver(partnerMetaSchema) });

  useEffect(() => {
    if (initial) {
      reset({
        type_of_business: initial.type_of_business ?? "",
        years_in_business: initial.years_in_business ?? 0,
        annual_revenue: initial.annual_revenue ?? 0,
        is_talko_enabled: initial.is_talko_enabled ?? false,
      });
    }
  }, [initial, reset]);

  return (
    <form onSubmit={handleSubmit((v) => onSubmit(v))} className="max-w-lg space-y-4">
      <TextField
        label="Type of business"
        error={errors.type_of_business?.message}
        {...register("type_of_business")}
      />
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Years in business"
          type="number"
          error={errors.years_in_business?.message}
          {...register("years_in_business")}
        />
        <TextField
          label="Annual revenue"
          type="number"
          error={errors.annual_revenue?.message}
          {...register("annual_revenue")}
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("is_talko_enabled")} />
        Talko enabled
      </label>
      {serverError && <p className="text-sm text-critical">{serverError}</p>}
      <button
        type="submit"
        disabled={isSaving}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isSaving ? "Saving…" : "Save meta"}
      </button>
    </form>
  );
}
