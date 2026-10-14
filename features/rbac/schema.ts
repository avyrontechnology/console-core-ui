import { z } from "zod";

/** Mirrors backend RoleData constraints. */
export const createRoleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  hierarchy: z.coerce.number().int(),
  description: z.string().min(1, "Description is required"),
  is_internal: z.boolean().optional(),
});

export type CreateRoleForm = z.infer<typeof createRoleSchema>;
