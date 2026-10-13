import { signOut } from "next-auth/react";

import { ApiClient } from "./api-client";

let currentToken: string | null = null;

/** Module-level token for the shared client. Set only by SessionLoader. */
export function setSharedToken(token: string | null) {
  currentToken = token;
}

/** Shared authed client for all feature code. */
export const consoleApi = new ApiClient({
  getToken: () => currentToken,
  onUnauthorized: () => {
    void signOut({ callbackUrl: "/login" });
  },
});
