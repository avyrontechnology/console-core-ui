"use client";

import { useCallback, useEffect, useState } from "react";

import { notificationsApi } from "./api";
import type {
  HistoryFilters,
  Notification,
  NotificationPreference,
  SubscribeInput,
} from "@/types/notification";

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Request failed";
}

interface HistoryState {
  data: Notification[] | null;
  count: number | null;
  isLoading: boolean;
  error: string | null;
}

export function useNotificationHistory(filters?: HistoryFilters) {
  const [state, setState] = useState<HistoryState>({
    data: null,
    count: null,
    isLoading: true,
    error: null,
  });
  const key = `${filters?.service_type ?? ""}|${filters?.limit ?? ""}|${filters?.offset ?? ""}|${filters?.state ?? ""}`;

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const result = await notificationsApi.history(filters);
      setState({
        data: result.notifications ?? [],
        count: result.count ?? null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        data: null,
        count: null,
        isLoading: false,
        error: toMessage(error),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...state, refresh };
}

export function useUnreadCount(serviceType?: string) {
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const result = await notificationsApi.unreadCount(serviceType);
      setCount(result.unread_count);
    } catch (err) {
      setCount(null);
      setError(toMessage(err));
    }
  }, [serviceType]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { count, error, refresh };
}

export function useMarkNotificationsRead() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markRead = useCallback(async (notificationIds: string[] = []) => {
    setIsSaving(true);
    setError(null);
    try {
      await notificationsApi.markRead(notificationIds);
      setIsSaving(false);
    } catch (err) {
      setIsSaving(false);
      setError(toMessage(err));
      throw err;
    }
  }, []);

  return { markRead, isSaving, error };
}

export function useNotificationPreferences() {
  const [data, setData] = useState<NotificationPreference[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await notificationsApi.getPreferences();
      setData(result.preferences ?? []);
      setIsLoading(false);
    } catch (err) {
      setData(null);
      setIsLoading(false);
      setError(toMessage(err));
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = useCallback(async (preferences: NotificationPreference[]) => {
    setIsSaving(true);
    setError(null);
    try {
      const result = await notificationsApi.updatePreferences(preferences);
      setData(result.preferences ?? preferences);
      setIsSaving(false);
      return result.preferences ?? preferences;
    } catch (err) {
      setIsSaving(false);
      setError(toMessage(err));
      throw err;
    }
  }, []);

  return { data, isLoading, isSaving, error, save, refresh };
}

export function useSubscribeNotifications() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = useCallback(async (input: SubscribeInput) => {
    setIsSaving(true);
    setError(null);
    try {
      const result = await notificationsApi.subscribe(input);
      setIsSaving(false);
      return result;
    } catch (err) {
      setIsSaving(false);
      setError(toMessage(err));
      throw err;
    }
  }, []);

  const unsubscribe = useCallback(async (identifier: string, serviceType?: string) => {
    setIsSaving(true);
    setError(null);
    try {
      const result = await notificationsApi.unsubscribe(identifier, serviceType);
      setIsSaving(false);
      return result;
    } catch (err) {
      setIsSaving(false);
      setError(toMessage(err));
      throw err;
    }
  }, []);

  return { subscribe, unsubscribe, isSaving, error };
}
