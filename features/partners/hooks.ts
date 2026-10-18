"use client";

import { useCallback, useEffect, useState } from "react";

import { partnersApi } from "./api";
import type {
  CreatePartnerInput,
  PaginatedPartners,
  Partner,
  UpdatePartnerInput,
} from "@/types/partner";

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

export function usePartners() {
  const [state, setState] = useState<AsyncState<PaginatedPartners>>(
    idle({ total_count: 0, limit: 100, offset: 0, partners_data: [] }),
  );

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const data = await partnersApi.list();
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({
        data: { total_count: 0, limit: 100, offset: 0, partners_data: [] },
        isLoading: false,
        error: toMessage(error),
      });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    ...state,
    partners: state.data?.partners_data ?? [],
    totalCount: state.data?.total_count ?? 0,
    refresh,
  };
}

export function usePartner(id: string | null) {
  const [state, setState] = useState<AsyncState<Partner>>(idle());

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setState((s) => ({ ...s, isLoading: true, error: null }));
    partnersApi
      .getById(id)
      .then((data) => {
        if (!cancelled) setState({ data, isLoading: false, error: null });
      })
      .catch((error: unknown) => {
        if (!cancelled) setState({ data: null, isLoading: false, error: toMessage(error) });
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return state;
}

export function useCreatePartner() {
  const [state, setState] = useState<MutationState>(idleMutation);

  const create = useCallback(async (input: CreatePartnerInput): Promise<Partner> => {
    setState({ isSaving: true, error: null });
    try {
      const partner = await partnersApi.create(input);
      setState({ isSaving: false, error: null });
      return partner;
    } catch (error) {
      setState({ isSaving: false, error: toMessage(error) });
      throw error;
    }
  }, []);

  return { ...state, create };
}

export function useUpdatePartner() {
  const [state, setState] = useState<MutationState>(idleMutation);

  const update = useCallback(async (id: string, input: UpdatePartnerInput): Promise<Partner> => {
    setState({ isSaving: true, error: null });
    try {
      const partner = await partnersApi.update(id, input);
      setState({ isSaving: false, error: null });
      return partner;
    } catch (error) {
      setState({ isSaving: false, error: toMessage(error) });
      throw error;
    }
  }, []);

  return { ...state, update };
}

export function useDeletePartner() {
  const [state, setState] = useState<MutationState>(idleMutation);

  const remove = useCallback(async (id: string): Promise<void> => {
    setState({ isSaving: true, error: null });
    try {
      await partnersApi.remove(id);
      setState({ isSaving: false, error: null });
    } catch (error) {
      setState({ isSaving: false, error: toMessage(error) });
      throw error;
    }
  }, []);

  return { ...state, remove };
}

export function useTogglePartnerActivation() {
  const [state, setState] = useState<MutationState>(idleMutation);

  const toggle = useCallback(async (id: string, isActive: boolean): Promise<Partner> => {
    setState({ isSaving: true, error: null });
    try {
      const partner = await partnersApi.toggleActivation(id, isActive);
      setState({ isSaving: false, error: null });
      return partner;
    } catch (error) {
      setState({ isSaving: false, error: toMessage(error) });
      throw error;
    }
  }, []);

  return { ...state, toggle };
}
