"use client";

import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

import { fetchUserPermissions, SessionExpiredError } from "@/features/auth/api";

/** Map UI boolean flag names to their equivalent RBAC slug names. */
const FLAG_TO_RBAC_SLUG: Record<string, string> = {
  can_view_dashboard: "console:get_partner_dashboard_cards",
  can_view_partners: "console:get_all_partners",
  can_view_permissions: "console:get_all_permission",
  can_view_users: "console:get_all_users",
  can_view_configurations: "console:get_partner_configs_by_partner_id",
  can_view_add_permissions: "console:create_permission",
  can_view_partner_info: "console:get_partner_meta_data",
  can_view_internal_roles: "console:get_roles",
  can_edit_internal_roles: "console:update_role",
  can_view_partner_config: "console:get_partner_configs_by_partner_id",
  can_assume_user: "console:assume_user",
  can_view_plans: "console:get_all_plans",
  can_view_order_history: "console:get_order_history",
  can_view_api_admin: "console:get_api_key",
};

/** Normalise whatever the session carries into a flat slug list. */
function toSlugList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((s): s is string => typeof s === "string");
  // Feature-flag maps (can_view_users, ...) grant access by truthy key.
  if (value && typeof value === "object") {
    const flags = Object.entries(value as Record<string, unknown>)
      .filter(([, granted]) => granted === true)
      .map(([flag]) => flag);
    // Append equivalent RBAC slugs so ProtectedRoute checks (which use
    // console:* slugs) match against session permissions too.
    const mapped = flags.flatMap((f) => FLAG_TO_RBAC_SLUG[f] ? [f, FLAG_TO_RBAC_SLUG[f]] : [f]);
    return [...new Set(mapped)];
  }
  return [];
}

export function usePermissions() {
  const { data: session, status } = useSession();
  const sessionSlugs = toSlugList(session?.permissions);
  const [fetched, setFetched] = useState<string[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const isAuthenticated = status === "authenticated";
  const accessToken = session?.accessToken;

  useEffect(() => {
    if (!isAuthenticated || !accessToken || fetched) return;
    let cancelled = false;
    void fetchUserPermissions(accessToken)
      .then((slugs) => {
        if (!cancelled) setFetched(slugs);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          // A dead session is being torn down (redirect to /login); showing
          // session flags here would report "Access forbidden" instead.
          setSessionExpired(error instanceof SessionExpiredError);
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
  const permissions = failed && !sessionExpired ? sessionSlugs : (fetched ?? sessionSlugs);

  return {
    isLoading: status === "loading" || (isAuthenticated && fetched === null),
    isAuthenticated,
    permissions,
    hasPermission: (slug: string) => permissions.includes(slug),
    hasAnyPermission: (slugs: string[]) => slugs.some((slug) => permissions.includes(slug)),
  };
}
