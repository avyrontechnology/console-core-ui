/** Order domain contracts (mirror of console-core order schemas). */

export type OrderStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED" | string;
export type OrderType = "FRESH" | "RENEWAL" | "UPGRADE" | "DOWNGRADE" | string;
export type PaymentMethod = "GATEWAY" | "DIRECT" | string;

export interface OrderHistoryItem {
  order_id: string;
  source: string;
  order_status: string;
  order_currency: string;
  merchant_transaction_id?: string | null;
  duration: number;
  is_manually_created: boolean;
  order_type: string;
  payment_method?: string | null;
  original_order_id?: string | null;
  partner_id?: string | null;
  partner_name?: string | null;
  partner_email?: string | null;
  partner_phone_number?: string | null;
  plan_id?: string | null;
  plan_name?: string | null;
  plan_type?: string | null;
  add_ons: Record<string, number>;
  plan_price?: number | null;
  total_price: number;
  order_created_at: number;
  entitlement_start_date?: number | null;
  entitlement_end_date?: number | null;
  entitlement_is_active?: boolean | null;
  payment_status?: string | null;
  subscription_status?: string | null;
}

export interface OrderHistoryResponse {
  total_count: number;
  limit: number;
  offset: number;
  data: OrderHistoryItem[];
}

export interface OrderHistoryParams {
  partner_ids?: string;
  limit?: number;
  offset?: number;
  source?: string;
  status?: string;
  is_manually_created?: boolean;
  order_type?: string;
}

export interface ManualOrderInput {
  partner_id: string;
  plan_id: string;
  amount: number;
  payment_method: "GATEWAY" | "DIRECT";
  currency?: string;
  add_ons?: Record<string, number>;
}

export interface ManualOrderResult {
  order: Record<string, unknown>;
  payment_gateway_order?: Record<string, unknown> | null;
}

export interface BillingDetailsInput {
  plan_id?: string;
  add_ons?: Record<string, number>;
  coupon?: string;
}
