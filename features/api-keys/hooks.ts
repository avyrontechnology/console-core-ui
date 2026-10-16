"use client";

import { useCallback, useEffect, useState } from "react";

import { apiKeysApi } from "./api";
import type { ApiKey, RotateKeyInput, UpdateKeyInput } from "@/types/api-key";

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

interface MutationState {
  isSaving: boolean;
  error: string | null;
}

const idleMutation: MutationState = { isSaving: false, error: null };

export function useApiKey() {
  const [state, setState] = useState<AsyncState<ApiKey>>(idle());

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const data = await apiKeysApi.current();
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({ data: null, isLoading: false, error: toMessage(error) });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...state, refresh };
}

export function useRotateKey() {
  const [state, setState] = useState<MutationState>(idleMutation);

  const rotate = useCallback(async (input?: RotateKeyInput): Promise<ApiKey> => {
    setState({ isSaving: true, error: null });
    try {
      const key = await apiKeysApi.rotate(input);
      setState({ isSaving: false, error: null });
      return key;
    } catch (error) {
      setState({ isSaving: false, error: toMessage(error) });
      throw error;
    }
  }, []);

  return { ...state, rotate };
}

export function useUpdateKey() {
  const [state, setState] = useState<MutationState>(idleMutation);

  const update = useCallback(async (input: UpdateKeyInput): Promise<ApiKey> => {
    setState({ isSaving: true, error: null });
    try {
      const key = await apiKeysApi.update(input);
      setState({ isSaving: false, error: null });
      return key;
    } catch (error) {
      setState({ isSaving: false, error: toMessage(error) });
      throw error;
    }
  }, []);

  return { ...state, update };
}

export function useInactivateKey() {
  const [state, setState] = useState<MutationState>(idleMutation);

  const inactivate = useCallback(async (): Promise<ApiKey> => {
    setState({ isSaving: true, error: null });
    try {
      const key = await apiKeysApi.inactivate();
      setState({ isSaving: false, error: null });
      return key;
    } catch (error) {
      setState({ isSaving: false, error: toMessage(error) });
      throw error;
    }
  }, []);

  return { ...state, inactivate };
}
