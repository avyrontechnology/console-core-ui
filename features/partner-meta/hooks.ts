"use client";

import { useCallback, useEffect, useState } from "react";

import { partnerMetaApi } from "./api";
import type { PartnerMeta, PartnerMetaInput } from "@/types/partner-meta";

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

export function usePartnerMeta(partnerId: string | null) {
  const [state, setState] = useState<AsyncState<PartnerMeta>>(idle());

  const refresh = useCallback(async () => {
    if (!partnerId) return;
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const data = await partnerMetaApi.get(partnerId);
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

export function useSavePartnerMeta() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(async (partnerId: string, input: PartnerMetaInput, exists: boolean) => {
    setIsSaving(true);
    setError(null);
    try {
      const result = exists
        ? await partnerMetaApi.update(partnerId, input)
        : await partnerMetaApi.create(partnerId, input);
      setIsSaving(false);
      return result;
    } catch (err) {
      setIsSaving(false);
      setError(toMessage(err));
      throw err;
    }
  }, []);

  return { save, isSaving, error };
}
