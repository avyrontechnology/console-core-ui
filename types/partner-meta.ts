/** Partner meta domain contracts (mirror of console-core partner_meta_data schemas). */

export interface PartnerMeta {
  id?: string;
  type_of_business?: string | null;
  years_in_business?: number | null;
  annual_revenue?: number | null;
  is_talko_enabled?: boolean | null;
  talko_trail_expiry_time?: number | null;
}

export interface PartnerMetaInput {
  type_of_business?: string;
  years_in_business?: number;
  annual_revenue?: number;
  is_talko_enabled?: boolean;
}
