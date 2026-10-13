"use client";

import { useSession } from "next-auth/react";

/** RBAC helpers, sourced only from the NextAuth session. */
export function usePermissions() {
  const { data: session, status } = useSession();
  const permissions = session?.permissions ?? [];

  return {
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    permissions,
    hasPermission: (slug: string) => permissions.includes(slug),
    hasAnyPermission: (slugs: string[]) => slugs.some((slug) => permissions.includes(slug)),
  };
}
