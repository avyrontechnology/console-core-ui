import { z } from "zod";

/** Mirrors backend PlanBase constraints. */
export const createPlanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
  discount_percentage: z.coerce.number().min(0).max(100).optional(),
  currency: z.string().min(2).max(4),
  duration: z.coerce.number().int().min(1, "Duration is required"),
  tag: z.string().min(1, "Tag is required"),
  hierarchy: z.coerce.number().int(),
  service_name: z.string().min(1, "Service is required"),
  plan_type: z.string().optional(),
  modules: z.array(z.string()).default([]),
  is_free_trial: z.boolean().optional(),
  otc_charge: z.coerce.number().min(0).optional(),
});

export type CreatePlanForm = z.infer<typeof createPlanSchema>;
