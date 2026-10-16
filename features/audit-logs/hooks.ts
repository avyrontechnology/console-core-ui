"use client";

import { useCallback, useEffect, useState } from "react";

import { auditLogsApi } from "./api";
import type { AuditLog, AuditLogFilters } from "@/types/audit-log";

interface AuditLogState {
  data: AuditLog[] | null;
  isLoading: boolean;
  error: string | null;
}

export function useAuditLogs(filters?: AuditLogFilters) {
  const [state, setState] = useState<AuditLogState>({
    data: null,
    isLoading: true,
    error: null,
  });
  const key = `${filters?.resource ?? ""}|${filters?.action ?? ""}|${filters?.limit ?? ""}|${filters?.offset ?? ""}`;

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const data = await auditLogsApi.list(filters);
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to load audit logs",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...state, refresh };
}
