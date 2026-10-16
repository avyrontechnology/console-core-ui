"use client";

import { useCallback, useEffect, useState } from "react";

import { walletApi } from "./api";
import type { Wallet, WalletTransactionList, WalletTransactionsParams } from "@/types/wallet";

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

export function useWallet(partnerId?: string) {
  const [state, setState] = useState<AsyncState<Wallet>>(idle());

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const data = await walletApi.get(partnerId);
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({ data: null, isLoading: false, error: toMessage(error) });
    }
  }, [partnerId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...state, refresh };
}

export function useWalletTransactions(params: WalletTransactionsParams) {
  const [state, setState] = useState<AsyncState<WalletTransactionList>>(idle());
  const key = JSON.stringify(params);

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const parsed = JSON.parse(key) as WalletTransactionsParams;
      const data = await walletApi.transactions(parsed);
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
