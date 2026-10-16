/** Payment domain contracts (mirror of console-core payment schemas). */

export interface PaymentHistoryResponse {
  total_count: number;
  limit: number;
  offset: number;
  data: Array<Record<string, unknown>>;
}

export interface PaymentHistoryParams {
  limit: number;
  offset: number;
}
