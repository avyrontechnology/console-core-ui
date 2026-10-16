import { consoleApi } from "@/lib/console";
import { ENDPOINTS } from "@/lib/endpoints";
import type { ApiKey, RotateKeyInput, UpdateKeyInput } from "@/types/api-key";

/** All API-key HTTP calls, in one place. Scoped to the caller's partner. */
export const apiKeysApi = {
  current(): Promise<ApiKey> {
    return consoleApi.get<ApiKey>(ENDPOINTS.API_KEY_GET());
  },

  rotate(input?: RotateKeyInput): Promise<ApiKey> {
    return consoleApi.post<ApiKey>(ENDPOINTS.API_KEY_ROTATE(), input ?? {});
  },

  update(input: UpdateKeyInput): Promise<ApiKey> {
    return consoleApi.patch<ApiKey>(ENDPOINTS.API_KEY_UPDATE(), input);
  },

  inactivate(): Promise<ApiKey> {
    return consoleApi.put<ApiKey>(ENDPOINTS.API_KEY_INACTIVATE());
  },
};
