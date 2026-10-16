import { z } from "zod";

/** Mirrors backend ManualOrderCreateRequest constraints. */
export const manualOrderSchema = z.object({
  partner_id: z.string().min(1, "Partner is required"),
  plan_id: z.string().min(1, "Plan is required"),
  amount: z.coerce.number().min(100, "Min amount is 100").max(50000000),
  payment_method: z.enum(["GATEWAY", "DIRECT"]),
  currency: z.string().length(3).default("INR"),
});

export type ManualOrderForm = z.infer<typeof manualOrderSchema>;
