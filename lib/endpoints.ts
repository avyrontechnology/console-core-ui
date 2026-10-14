import { getEnv } from "./env";

const API_PREFIX = "/console-service/v1";

function url(path: string): string {
  return `${getEnv().NEXT_PUBLIC_CONSOLE_BASE_URL}${API_PREFIX}${path}`;
}

/** All backend URLs, in one place. No string literals elsewhere. */
export const ENDPOINTS = {
  LOGIN: () => url("/do_login?svc_name=console"),
  LOGOUT: () => url("/logout"),
  HOMEPAGE_DETAILS: () => url("/partner_homepage_details"),
  USERS: (params?: { offset?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.offset !== undefined) query.set("offset", String(params.offset));
    if (params?.limit !== undefined) query.set("limit", String(params.limit));
    const suffix = query.toString();
    return url(`/users${suffix ? `?${suffix}` : ""}`);
  },
  USER_BY_ID: (id: string) => url(`/user/get_by_id/${id}`),
  USER_CREATE: () => url("/do_signup?svc_name=console"),
  USER_UPDATE: (id: string) => url(`/user/${id}`),
  USER_DELETE: (id: string) => url(`/user/${id}`),
  ROLES: () => url("/role"),
  PARTNERS: () => url("/partners"),
  PARTNER_BY_ID: (id: string) => url(`/partner/${id}`),
  PARTNER_CREATE: () => url("/create_partner"),
  PARTNER_UPDATE: (id: string) => url(`/partner/${id}`),
  PARTNER_DELETE: (id: string) => url(`/partner/${id}`),
  PARTNER_TOGGLE_ACTIVATION: (id: string) => url(`/partner/${id}/toggle_activation`),
  ROLES_LIST: () => url("/role"),
  ROLE_CREATE: () => url("/role"),
  ROLE_BY_ID: (id: string) => url(`/role/${id}`),
  ROLE_UPDATE: (id: string) => url(`/role/${id}`),
  ROLE_DELETE: (id: string) => url(`/role/${id}`),
  PERMISSIONS_LIST: () => url("/permission"),
  PERMISSION_MATRIX: () => url("/get_permissions_for_all_roles"),
  ROLE_ACTION_PERMISSIONS: (roleId: string) =>
    url(`/default_role_permission/role/${roleId}/action-permissions`),
  PLANS: (params?: { service_name?: string; plan_type?: string }) => {
    const query = new URLSearchParams();
    if (params?.service_name) query.set("service_name", params.service_name);
    if (params?.plan_type) query.set("plan_type", params.plan_type);
    const suffix = query.toString();
    return url(`/get-plans${suffix ? `?${suffix}` : ""}`);
  },
  PLAN_BY_ID: (id: string) => url(`/get-plan-by-id/${id}`),
  PLAN_CREATE: () => url("/create-plan"),
  PLAN_UPDATE: (id: string) => url(`/update-plan/${id}`),
  PLAN_DELETE: (id: string) => url(`/delete-plan/${id}`),
  PLAN_MODULES: () => url("/get-modules"),
} as const;
