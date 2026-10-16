/** Entitlement domain contracts (mirror of console-core entitlement schemas). */

export interface UpdateStartDateInput {
  order_id: string;
  start_date: number;
}

export interface UpdatedEntitlement {
  id: string;
  order_id: string;
  partner_id: string;
  service_name: string;
  start_date: number;
  end_date: number;
  is_active: boolean;
  start_date_update_count: number;
}
