"use client";

import { useCallback, useEffect, useState } from "react";

import { dashboardApi } from "./api";
import type { DashboardCard, HomepageDetails } from "@/types/dashboard";

interface DashboardState {
  data: DashboardCard[] | null;
  isLoading: boolean;
  error: string | null;
}

export function useDashboardCards() {
  const [state, setState] = useState<DashboardState>({
    data: null,
    isLoading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const data = await dashboardApi.cards();
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to load dashboard",
      });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...state, refresh };
}

interface HomepageState {
  data: HomepageDetails | null;
  isLoading: boolean;
  error: string | null;
}

export function useHomepageDetails() {
  const [state, setState] = useState<HomepageState>({
    data: null,
    isLoading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const data = await dashboardApi.homepage();
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to load homepage",
      });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...state, refresh };
}
