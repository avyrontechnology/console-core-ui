/** Notification domain contracts (mirror of console-core notification schemas). */

export const NOTIFICATION_SERVICE_TYPES = ["talko", "obotaai"] as const;
export type NotificationServiceType = (typeof NOTIFICATION_SERVICE_TYPES)[number];

export const NOTIFICATION_SOURCES = ["talko", "obotaai"] as const;
export type NotificationSource = (typeof NOTIFICATION_SOURCES)[number];

export const NOTIFICATION_SCOPES = [
  "all",
  "lead_assigned",
  "bulk_lead_assigned",
  "followup",
  "whatsapp",
] as const;
export type NotificationScope = (typeof NOTIFICATION_SCOPES)[number];

export type NotificationPreferenceState = "enabled" | "disabled";

export const CHANNEL_TYPES = ["FCM", "WEBHOOK", "IN_APP"] as const;
export type ChannelType = (typeof CHANNEL_TYPES)[number];

export interface NotificationPreference {
  source: NotificationSource;
  scope?: NotificationScope | null;
  state: NotificationPreferenceState;
}

export interface NotificationPreferencePayload {
  user_id: string;
  preferences: NotificationPreference[];
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  data_payload?: Record<string, unknown> | null;
  service_type?: NotificationServiceType | null;
  is_read: boolean;
  created_at: number;
}

export interface NotificationHistory {
  notifications: Notification[];
  count?: number | null;
}

export interface UnreadCount {
  unread_count: number;
  service_type?: NotificationServiceType | null;
}

export interface HistoryFilters {
  service_type?: NotificationServiceType;
  limit?: number;
  offset?: number;
  state?: string;
}

export interface SubscribeInput {
  channel_type: ChannelType;
  identifier: string;
  service_type?: NotificationServiceType;
  meta_data?: Record<string, unknown> | null;
}
