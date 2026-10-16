"use client";

import { useCallback, useState } from "react";

import { entitlementsApi } from "./api";
import type { UpdateStartDateInput, UpdatedEntitlement } from "@/types/entitlement";

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Request failed";
}

export function useUpdateStartDate() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (input: UpdateStartDateInput): Promise<UpdatedEntitlement[]> => {
    setIsSaving(true);
    setError(null);
    try {
      const result = await entitlementsApi.updateStartDate(input);
      setIsSaving(false);
      return result;
    } catch (err) {
      setIsSaving(false);
      setError(toMessage(err));
      throw err;
    }
  }, []);

  return { update, isSaving, error };
}
