"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { TextField } from "@/components/ui/TextField";
import { createRoleSchema, type CreateRoleForm } from "@/features/rbac/schema";

export function RoleForm({
  onSubmit,
  isSaving,
  serverError,
  submitLabel = "Create role",
}: {
  onSubmit: (values: CreateRoleForm) => Promise<void>;
  isSaving: boolean;
  serverError: string | null;
  submitLabel?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoleForm>({ resolver: zodResolver(createRoleSchema) });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
      className="max-w-lg space-y-4"
    >
      <TextField label="Name" error={errors.name?.message} {...register("name")} />
      <TextField label="Slug" error={errors.slug?.message} {...register("slug")} />
      <TextField
        label="Hierarchy (lower = more senior)"
        type="number"
        error={errors.hierarchy?.message}
        {...register("hierarchy")}
      />
      <TextField
        label="Description"
        error={errors.description?.message}
        {...register("description")}
      />
      {serverError && <p className="text-sm text-critical">{serverError}</p>}
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
