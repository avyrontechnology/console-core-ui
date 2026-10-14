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
} as const;
