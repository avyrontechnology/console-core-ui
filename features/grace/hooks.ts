"use client";

import { useCallback, useEffect, useState } from "react";

import { graceApi } from "./api";
import type { GraceRecord, GraceStatus, GrantGraceInput } from "@/types/grace";

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

export function useGraceStatus(partnerId: string | null) {
  const [state, setState] = useState<AsyncState<GraceStatus>>(idle());

  const refresh = useCallback(async () => {
    if (!partnerId) return;
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const data = await graceApi.status(partnerId);
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

export function useGrantGrace() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const grant = useCallback(async (input: GrantGraceInput): Promise<GraceRecord> => {
    setIsSaving(true);
    setError(null);
    try {
      const result = await graceApi.grant(input);
      setIsSaving(false);
      return result;
    } catch (err) {
      setIsSaving(false);
      setError(toMessage(err));
      throw err;
    }
  }, []);

  return { grant, isSaving, error };
}
