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
} as const;
