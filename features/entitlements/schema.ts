import { z } from "zod";

/** Mirrors backend UpdateEntitlementStartDateRequest (13-digit ms). */
export const updateStartDateSchema = z.object({
  order_id: z.string().min(1, "Order is required"),
  start_date: z.coerce
    .number()
    .int()
    .positive("Start date must be positive")
    .refine((v) => String(v).length === 13, "Start date must be 13-digit ms"),
});

export type UpdateStartDateForm = z.infer<typeof updateStartDateSchema>;
