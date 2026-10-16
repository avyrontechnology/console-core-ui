/** Wallet domain contracts (mirror of console-core wallet schemas). */

export interface Wallet {
  partner_id: string;
  balance: number;
  frozen_balance: number;
  currency: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  transaction_type: string;
  service_name: string;
  previous_balance: number;
  amount: number;
  remaining_balance: number;
  description?: string | null;
  attributes?: Record<string, unknown> | null;
  status: string;
  created_at: number;
  additional_info?: unknown;
}

export interface WalletTransactionList {
  total_count: number;
  limit: number;
  offset: number;
  transactions: WalletTransaction[];
}

export interface WalletTransactionsParams {
  partner_id?: string;
  limit: number;
  offset: number;
  start_date?: number;
  end_date?: number;
  service_name?: string;
  transaction_type?: string;
}
