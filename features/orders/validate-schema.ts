import { z } from "zod";

/** Mirrors backend OrderValidateRequest. */
export const validateOrderSchema = z.object({
  order_id: z.string().min(1, "Gateway order id is required"),
  payment_id: z.string().min(1, "Payment id is required"),
  signature: z.string().min(1, "Signature is required"),
});

export type ValidateOrderForm = z.infer<typeof validateOrderSchema>;
