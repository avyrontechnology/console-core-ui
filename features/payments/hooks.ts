"use client";

import { useCallback, useEffect, useState } from "react";

import { paymentsApi } from "./api";
import type { PaymentHistoryResponse } from "@/types/payment";

interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function usePaymentHistory(limit = 20, offset = 1) {
  const [state, setState] = useState<AsyncState<PaymentHistoryResponse>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const data = await paymentsApi.history({ limit, offset });
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error.message : "Request failed",
      });
    }
  }, [limit, offset]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...state, refresh };
}
