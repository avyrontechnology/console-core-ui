"use client";

import { useCallback, useEffect, useState } from "react";

import { userConfigsApi } from "./api";
import { USER_CONFIG_KEYS, type UserConfig, type UserConfigFlags } from "@/types/user-config";

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Request failed";
}

/** Flattens the key/value config list into the boolean flags the API expects. */
export function toFlags(configs: UserConfig[]): Partial<UserConfigFlags> {
  const flags: Partial<UserConfigFlags> = {};
  for (const config of configs) {
    if (!config.key) continue;
    if ((USER_CONFIG_KEYS as readonly string[]).includes(config.key)) {
      flags[config.key as keyof UserConfigFlags] = Boolean(config.value);
    }
  }
  return flags;
}

export function useUserConfigs(userId?: string) {
  const [data, setData] = useState<UserConfig[] | null>(null);
  const [flags, setFlags] = useState<Partial<UserConfigFlags>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const configs = await userConfigsApi.list(userId);
      setData(configs);
      setFlags(toFlags(configs));
      setIsLoading(false);
    } catch (err) {
      setData(null);
      setIsLoading(false);
      setError(toMessage(err));
    }
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = useCallback(
    async (partnerId: string, userIds: string[], next: Partial<UserConfigFlags>) => {
      setIsSaving(true);
      setError(null);
      try {
        const updated = await userConfigsApi.upsert(partnerId, userIds, next);
        setIsSaving(false);
        return updated;
      } catch (err) {
        setIsSaving(false);
        setError(toMessage(err));
        throw err;
      }
    },
    [],
  );

  return { data, flags, isLoading, isSaving, error, save, refresh };
}
