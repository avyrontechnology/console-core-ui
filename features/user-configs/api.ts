import { consoleApi } from "@/lib/console";
import { ENDPOINTS } from "@/lib/endpoints";
import type {
  UpdatedUserConfig,
  UserConfig,
  UserConfigFlags,
  UserConfigValue,
} from "@/types/user-config";

/** All user-config HTTP calls, in one place. */
export const userConfigsApi = {
  list(userId?: string): Promise<UserConfig[]> {
    return consoleApi.get<UserConfig[]>(
      ENDPOINTS.USER_CONFIGS(userId ? { user_id: userId } : undefined),
    );
  },

  getByKey(key: string): Promise<UserConfig> {
    return consoleApi.get<UserConfig>(ENDPOINTS.USER_CONFIG_BY_KEY(key));
  },

  create(payload: { user_id: string; key: string; value?: UserConfigValue }): Promise<UserConfig> {
    return consoleApi.post<UserConfig, { user_id: string; key: string; value?: UserConfigValue }>(
      ENDPOINTS.USER_CONFIG_CREATE(),
      payload,
    );
  },

  upsert(partnerId: string, userIds: string[], flags: Partial<UserConfigFlags>) {
    return consoleApi.patch<UpdatedUserConfig[], Partial<UserConfigFlags>>(
      ENDPOINTS.USER_CONFIG_UPSERT(partnerId, userIds),
      flags,
    );
  },
};
