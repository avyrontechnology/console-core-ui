/** Partner domain contracts (mirror of console-core partner schemas). */

export interface Partner {
  id: string;
  name: string;
  company_legal_name: string;
  gst_no?: string | null;
  cin_no?: string | null;
  active_license?: number | null;
  description?: string | null;
  email?: string | null;
  phone_number?: string | null;
  is_active?: boolean | null;
  partner_status?: string | null;
}

export interface CreatePartnerInput {
  name: string;
  company_legal_name: string;
  gst_no?: string;
  cin_no?: string;
  active_license?: number;
  description?: string;
}

export type UpdatePartnerInput = Partial<
  Pick<
    Partner,
    | "name"
    | "company_legal_name"
    | "gst_no"
    | "cin_no"
    | "active_license"
    | "description"
    | "email"
    | "phone_number"
  >
>;
