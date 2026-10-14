"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { TextField } from "@/components/ui/TextField";
import { createPlanSchema, type CreatePlanForm } from "@/features/plans/schema";
import type { z } from "zod";

type PlanFormInput = z.input<typeof createPlanSchema>;

export function PlanForm({
  availableModules,
  onSubmit,
  isSaving,
  serverError,
  submitLabel = "Create plan",
}: {
  availableModules: string[];
  onSubmit: (values: CreatePlanForm) => Promise<void>;
  isSaving: boolean;
  serverError: string | null;
  submitLabel?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlanFormInput>({ resolver: zodResolver(createPlanSchema) });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        const complete: CreatePlanForm = {
          ...values,
          modules: values.modules ?? [],
        };
        await onSubmit(complete);
      })}
      className="max-w-lg space-y-4"
    >
      <TextField label="Name" error={errors.name?.message} {...register("name")} />
      <TextField label="Tag" error={errors.tag?.message} {...register("tag")} />
      <TextField
        label="Service name"
        error={errors.service_name?.message}
        {...register("service_name")}
      />
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Price"
          type="number"
          error={errors.price?.message}
          {...register("price")}
        />
        <TextField label="Currency" error={errors.currency?.message} {...register("currency")} />
        <TextField
          label="Duration (days)"
          type="number"
          error={errors.duration?.message}
          {...register("duration")}
        />
        <TextField
          label="Hierarchy"
          type="number"
          error={errors.hierarchy?.message}
          {...register("hierarchy")}
        />
      </div>
      <TextField
        label="Description (optional)"
        error={errors.description?.message}
        {...register("description")}
      />
      <fieldset>
        <legend className="mb-1 text-sm font-medium">Modules</legend>
        {availableModules.length === 0 && (
          <p className="text-sm text-gray-500">No modules available</p>
        )}
        <div className="space-y-1">
          {availableModules.map((mod) => (
            <label key={mod} className="flex items-center gap-2 text-sm">
              <input type="checkbox" value={mod} {...register("modules")} />
              <span className="font-mono text-xs">{mod}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button
        type="submit"
        disabled={isSaving}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isSaving ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
