import { signOut } from "next-auth/react";

import { ENDPOINTS } from "@/lib/endpoints";

export class SessionExpiredError extends Error {
  constructor() {
    super("Session expired");
    this.name = "SessionExpiredError";
  }
}

/** Permission slugs granted to the caller. */
export async function fetchUserPermissions(accessToken: string): Promise<string[]> {
  const response = await fetch(ENDPOINTS.USER_PERMISSIONS(), {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (response.status === 401) {
    // The console token is dead (expired/rotated). Falling back to session
    // flags here would show "Access forbidden" for a user who still has full
    // access, so force a re-login instead.
    void signOut({ callbackUrl: "/login" });
    throw new SessionExpiredError();
  }

  if (!response.ok) {
    throw new Error(`Failed to load permissions (${response.status})`);
  }

  const payload = (await response.json()) as { data?: unknown };
  const data: unknown = payload?.data;
  if (Array.isArray(data)) return data.filter((s): s is string => typeof s === "string");
  // Guard against the backend ever changing the shape again.
  return [];
}
