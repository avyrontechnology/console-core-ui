"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { TextField } from "@/components/ui/TextField";
import { createUserSchema, type CreateUserForm } from "@/features/users/schema";
import type { Role } from "@/types/user";

export function UserForm({
  roles,
  defaultPartnerId = "",
  onSubmit,
  isSaving,
  serverError,
  submitLabel = "Create user",
}: {
  roles: Role[];
  defaultPartnerId?: string;
  onSubmit: (values: CreateUserForm) => Promise<void>;
  isSaving: boolean;
  serverError: string | null;
  submitLabel?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: defaultPartnerId ? { partner_id: defaultPartnerId } : undefined,
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
      className="max-w-lg space-y-4"
    >
      <TextField label="Name" error={errors.name?.message} {...register("name")} />
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <TextField
        label="Phone number"
        autoComplete="tel"
        error={errors.phone_number?.message}
        {...register("phone_number")}
      />
      <TextField
        label="Password"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <div>
        <label htmlFor="role_id" className="mb-1 block text-sm font-medium">
          Role
        </label>
        <select id="role_id" className="w-full rounded border px-3 py-2" {...register("role_id")}>
          <option value="">Select a role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
        {errors.role_id && <p className="mt-1 text-sm text-red-600">{errors.role_id.message}</p>}
      </div>
      <TextField
        label="Partner ID"
        error={errors.partner_id?.message}
        {...register("partner_id")}
      />
      <TextField
        label="Designation (optional)"
        error={errors.designation?.message}
        {...register("designation")}
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
