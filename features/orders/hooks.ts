"use client";

import { useCallback, useEffect, useState } from "react";

import { ordersApi } from "./api";
import type {
  ManualOrderInput,
  ManualOrderResult,
  OrderHistoryParams,
  OrderHistoryResponse,
} from "@/types/order";

interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

const idle = <T>(data: T | null = null): AsyncState<T> => ({
  data,
  isLoading: false,
  error: null,
});

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Request failed";
}

export function useOrderHistory(params?: OrderHistoryParams) {
  const [state, setState] = useState<AsyncState<OrderHistoryResponse>>(idle());
  const key = JSON.stringify(params ?? null);

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const parsed: OrderHistoryParams | undefined = key ? JSON.parse(key) : undefined;
      const data = await ordersApi.history(parsed);
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({ data: null, isLoading: false, error: toMessage(error) });
    }
  }, [key]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...state, refresh };
}

export function useCreateManualOrder() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (input: ManualOrderInput): Promise<ManualOrderResult> => {
    setIsSaving(true);
    setError(null);
    try {
      const result = await ordersApi.createManual(input);
      setIsSaving(false);
      return result;
    } catch (err) {
      setIsSaving(false);
      setError(toMessage(err));
      throw err;
    }
  }, []);

  return { create, isSaving, error };
}

export function useValidateOrder() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(
    async (input: { order_id: string; payment_id: string; signature: string }) => {
      setIsSaving(true);
      setError(null);
      try {
        const result = await ordersApi.validate(input);
        setIsSaving(false);
        return result;
      } catch (err) {
        setIsSaving(false);
        setError(toMessage(err));
        throw err;
      }
    },
    [],
  );

  return { validate, isSaving, error };
}
