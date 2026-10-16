import { consoleApi } from "@/lib/console";
import { ENDPOINTS } from "@/lib/endpoints";
import type {
  BillingDetailsInput,
  ManualOrderInput,
  ManualOrderResult,
  OrderHistoryParams,
  OrderHistoryResponse,
} from "@/types/order";

/** All order HTTP calls, in one place. */
export const ordersApi = {
  history(params?: OrderHistoryParams): Promise<OrderHistoryResponse> {
    return consoleApi.get<OrderHistoryResponse>(ENDPOINTS.ORDERS_HISTORY(params));
  },

  createManual(input: ManualOrderInput): Promise<ManualOrderResult> {
    return consoleApi.post<ManualOrderResult>(ENDPOINTS.ORDERS_MANUAL(), input);
  },

  billingDetails(input: BillingDetailsInput): Promise<Record<string, unknown>> {
    return consoleApi.post<Record<string, unknown>>(ENDPOINTS.ORDERS_BILLING(), input);
  },

  calculateAmount(amount: number, currency: string): Promise<Record<string, unknown>> {
    return consoleApi.get<Record<string, unknown>>(
      ENDPOINTS.ORDERS_CALCULATE({ amount, currency }),
    );
  },

  initiate(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    return consoleApi.post<Record<string, unknown>>(ENDPOINTS.ORDERS_INITIATE(), input);
  },

  validate(input: {
    order_id: string;
    payment_id: string;
    signature: string;
  }): Promise<Record<string, unknown>> {
    return consoleApi.post<Record<string, unknown>>(ENDPOINTS.ORDERS_VALIDATE(), input);
  },
};
