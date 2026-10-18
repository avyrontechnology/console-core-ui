import { consoleApi } from "@/lib/console";
import { ENDPOINTS } from "@/lib/endpoints";
import type {
  HistoryFilters,
  NotificationPreference,
  NotificationPreferencePayload,
  NotificationHistory,
  SubscribeInput,
  UnreadCount,
} from "@/types/notification";

/** All notification HTTP calls, in one place. */
export const notificationsApi = {
  getPreferences(): Promise<NotificationPreferencePayload> {
    return consoleApi.get<NotificationPreferencePayload>(ENDPOINTS.NOTIFICATION_PREFERENCES());
  },

  updatePreferences(preferences: NotificationPreference[]): Promise<NotificationPreferencePayload> {
    return consoleApi.patch<
      NotificationPreferencePayload,
      { preferences: NotificationPreference[] }
    >(ENDPOINTS.NOTIFICATION_PREFERENCES(), { preferences });
  },

  history(filters?: HistoryFilters): Promise<NotificationHistory> {
    return consoleApi.get<NotificationHistory>(ENDPOINTS.NOTIFICATION_HISTORY(filters));
  },

  unreadCount(serviceType?: string): Promise<UnreadCount> {
    return consoleApi.get<UnreadCount>(ENDPOINTS.NOTIFICATION_UNREAD_COUNT(serviceType));
  },

  markRead(notificationIds?: string[]): Promise<string> {
    // Empty array marks all notifications as read.
    return consoleApi.patch<string, { notification_ids: string[] }>(
      ENDPOINTS.NOTIFICATION_MARK_READ(),
      { notification_ids: notificationIds ?? [] },
    );
  },

  subscribe(input: SubscribeInput): Promise<unknown> {
    return consoleApi.post<unknown, SubscribeInput>(ENDPOINTS.NOTIFICATION_SUBSCRIBE(), input);
  },

  unsubscribe(identifier: string, serviceType?: string): Promise<unknown> {
    return consoleApi.delete<unknown>(
      ENDPOINTS.NOTIFICATION_UNSUBSCRIBE({
        identifier,
        ...(serviceType ? { service_type: serviceType } : {}),
      }),
    );
  },
};
