import { z } from "zod";

/** Mirrors backend PartnerMetadata constraints. */
export const partnerMetaSchema = z.object({
  type_of_business: z.string().min(3).max(64).optional().or(z.literal("")),
  years_in_business: z.coerce.number().int().min(0).optional(),
  annual_revenue: z.coerce.number().int().min(0).optional(),
  is_talko_enabled: z.boolean().optional(),
});

export type PartnerMetaForm = z.infer<typeof partnerMetaSchema>;
