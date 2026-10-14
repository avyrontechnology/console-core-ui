"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { TextField } from "@/components/ui/TextField";
import { createPartnerSchema, type CreatePartnerForm } from "@/features/partners/schema";

export function PartnerForm({
  onSubmit,
  isSaving,
  serverError,
  submitLabel = "Create partner",
}: {
  onSubmit: (values: CreatePartnerForm) => Promise<void>;
  isSaving: boolean;
  serverError: string | null;
  submitLabel?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePartnerForm>({ resolver: zodResolver(createPartnerSchema) });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
      className="max-w-lg space-y-4"
    >
      <TextField label="Name" error={errors.name?.message} {...register("name")} />
      <TextField
        label="Company legal name"
        error={errors.company_legal_name?.message}
        {...register("company_legal_name")}
      />
      <TextField
        label="GST number (optional)"
        error={errors.gst_no?.message}
        {...register("gst_no")}
      />
      <TextField
        label="CIN number (optional)"
        error={errors.cin_no?.message}
        {...register("cin_no")}
      />
      <TextField
        label="Active licenses"
        type="number"
        error={errors.active_license?.message}
        {...register("active_license")}
      />
      <TextField
        label="Description (optional)"
        error={errors.description?.message}
        {...register("description")}
      />
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
