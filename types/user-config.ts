/** User-config domain contracts (mirror of console-core user_config schemas). */

export type UserConfigValue = string | number | boolean | Record<string, unknown> | unknown[];

export interface UserConfig {
  id?: string | null;
  key?: string | null;
  value?: UserConfigValue | null;
  user_id?: string | null;
  created_at?: number | null;
  history?: unknown[] | null;
}

export interface UpdatedUserConfig extends UserConfig {
  updated_at: number;
  updated_by: string;
}

/** Every boolean toggle accepted by PATCH /user-configs/{partner_id}. */
export const USER_CONFIG_KEYS = [
  "is_super_admin",
  "is_talko_enabled",
  "is_gsm_calling_enabled",
  "is_meeting_log_enabled",
  "can_view_contact",
  "can_view_organization",
  "is_obotaai_enabled",
  "enable_dialer",
  "can_view_products",
  "can_view_inventory",
  "can_view_payment_history",
  "can_view_report_management",
] as const;

export type UserConfigKey = (typeof USER_CONFIG_KEYS)[number];

export type UserConfigFlags = Record<UserConfigKey, boolean>;
