import { z } from "zod";

/** Mirrors backend GrantGraceRequest (days 1..max, remark 1..500). */
export const grantGraceSchema = z.object({
  partner_id: z.string().min(1, "Partner is required"),
  granted_days: z.coerce.number().int().min(1).max(365),
  remark: z.string().min(1, "Remark is required").max(500),
});

export type GrantGraceForm = z.infer<typeof grantGraceSchema>;
