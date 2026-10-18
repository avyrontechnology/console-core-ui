"use client";

import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

import { fetchUserPermissions } from "@/features/auth/api";

/** Normalise whatever the session carries into a flat slug list. */
function toSlugList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((s): s is string => typeof s === "string");
  // Feature-flag maps (can_view_users, ...) grant access by truthy key.
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .filter(([, granted]) => granted === true)
      .map(([flag]) => flag);
  }
  return [];
}

export function usePermissions() {
  const { data: session, status } = useSession();
  const sessionSlugs = toSlugList(session?.permissions);
  const [fetched, setFetched] = useState<string[] | null>(null);
  const [failed, setFailed] = useState(false);
  const isAuthenticated = status === "authenticated";
  const accessToken = session?.accessToken;

  useEffect(() => {
    if (!isAuthenticated || !accessToken || fetched) return;
    let cancelled = false;
    void fetchUserPermissions(accessToken)
      .then((slugs) => {
        if (!cancelled) setFetched(slugs);
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
          setFetched([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, accessToken, fetched]);

  // Real RBAC slugs win; the session flags remain the fallback so the shell
  // still renders if the permissions endpoint is unavailable.
  const permissions = failed ? sessionSlugs : (fetched ?? sessionSlugs);

  return {
    isLoading: status === "loading" || (isAuthenticated && fetched === null),
    isAuthenticated,
    permissions,
    hasPermission: (slug: string) => permissions.includes(slug),
    hasAnyPermission: (slugs: string[]) => slugs.some((slug) => permissions.includes(slug)),
  };
}
