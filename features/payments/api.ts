import { consoleApi } from "@/lib/console";
import { ENDPOINTS } from "@/lib/endpoints";
import type { PaymentHistoryParams, PaymentHistoryResponse } from "@/types/payment";

/** All payment HTTP calls, in one place. */
export const paymentsApi = {
  history(params: PaymentHistoryParams): Promise<PaymentHistoryResponse> {
    return consoleApi.get<PaymentHistoryResponse>(ENDPOINTS.PAYMENT_HISTORY(params));
  },
};
