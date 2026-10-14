"use client";

import { useCallback, useEffect, useState } from "react";

import { plansApi } from "./api";
import type {
  CreatePlanInput,
  Plan,
  PlanListParams,
  ServiceModules,
  UpdatePlanInput,
} from "@/types/plan";

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

export function usePlans(params?: PlanListParams) {
  const [state, setState] = useState<AsyncState<Plan[]>>(idle([]));
  const serviceName = params?.service_name;
  const planType = params?.plan_type;

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const data = await plansApi.list(
        serviceName || planType ? { service_name: serviceName, plan_type: planType } : undefined,
      );
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({ data: [], isLoading: false, error: toMessage(error) });
    }
  }, [serviceName, planType]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...state, refresh };
}

export function usePlan(id: string | null) {
  const [state, setState] = useState<AsyncState<Plan>>(idle());

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setState((s) => ({ ...s, isLoading: true, error: null }));
    plansApi
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

export function useCreatePlan() {
  const [state, setState] = useState<MutationState>(idleMutation);

  const create = useCallback(async (input: CreatePlanInput): Promise<Plan> => {
    setState({ isSaving: true, error: null });
    try {
      const plan = await plansApi.create(input);
      setState({ isSaving: false, error: null });
      return plan;
    } catch (error) {
      setState({ isSaving: false, error: toMessage(error) });
      throw error;
    }
  }, []);

  return { ...state, create };
}

export function useUpdatePlan() {
  const [state, setState] = useState<MutationState>(idleMutation);

  const update = useCallback(async (id: string, input: UpdatePlanInput): Promise<Plan> => {
    setState({ isSaving: true, error: null });
    try {
      const plan = await plansApi.update(id, input);
      setState({ isSaving: false, error: null });
      return plan;
    } catch (error) {
      setState({ isSaving: false, error: toMessage(error) });
      throw error;
    }
  }, []);

  return { ...state, update };
}

export function useDeletePlan() {
  const [state, setState] = useState<MutationState>(idleMutation);

  const remove = useCallback(async (id: string): Promise<void> => {
    setState({ isSaving: true, error: null });
    try {
      await plansApi.remove(id);
      setState({ isSaving: false, error: null });
    } catch (error) {
      setState({ isSaving: false, error: toMessage(error) });
      throw error;
    }
  }, []);

  return { ...state, remove };
}

export function usePlanModules() {
  const [state, setState] = useState<AsyncState<ServiceModules>>(idle({}));

  useEffect(() => {
    let cancelled = false;
    plansApi
      .modules()
      .then((data) => {
        if (!cancelled) setState({ data, isLoading: false, error: null });
      })
      .catch((error: unknown) => {
        if (!cancelled) setState({ data: {}, isLoading: false, error: toMessage(error) });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
