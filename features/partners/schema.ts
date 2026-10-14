import { z } from "zod";

const GST_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const CIN_RE = /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

/** Mirrors backend BasePartnerData constraints (lengths, GST/CIN formats). */
export const createPartnerSchema = z.object({
  name: z.string().min(1, "Name is required").max(128),
  company_legal_name: z.string().min(1, "Legal name is required").max(128),
  gst_no: z.string().regex(GST_RE, "Invalid GST number").optional().or(z.literal("")),
  cin_no: z.string().regex(CIN_RE, "Invalid CIN number").optional().or(z.literal("")),
  active_license: z.coerce.number().int().min(0).optional(),
  description: z.string().max(256).optional(),
});

export type CreatePartnerForm = z.infer<typeof createPartnerSchema>;
