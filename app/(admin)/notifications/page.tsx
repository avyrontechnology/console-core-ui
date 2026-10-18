"use client";

import { useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { NotificationList } from "@/features/notifications/components/NotificationList";
import { PreferenceEditor } from "@/features/notifications/components/PreferenceEditor";
import {
  useMarkNotificationsRead,
  useNotificationHistory,
  useNotificationPreferences,
  useUnreadCount,
} from "@/features/notifications/hooks";
import { NOTIFICATION_SERVICE_TYPES, type NotificationServiceType } from "@/types/notification";

function NotificationsContent() {
  const [serviceType, setServiceType] = useState<NotificationServiceType>("talko");
  const {
    data: notifications,
    isLoading,
    error,
    refresh,
  } = useNotificationHistory({
    service_type: serviceType,
    limit: 50,
  });
  const { count } = useUnreadCount(serviceType);
  const { markRead, isSaving } = useMarkNotificationsRead();
  const {
    data: preferences,
    isLoading: prefsLoading,
    isSaving: prefsSaving,
    error: prefsError,
    save,
  } = useNotificationPreferences();

  const markAllRead = async () => {
    await markRead([]);
    await refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Notifications</h1>
        <span className="rounded bg-red-600 px-2 py-0.5 text-xs text-white">
          {count ?? 0} unread
        </span>
        <label className="text-sm">
          Service
          <select
            aria-label="Service"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value as NotificationServiceType)}
            className="ml-2 rounded border px-2 py-1"
          >
            {NOTIFICATION_SERVICE_TYPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={markAllRead}
          disabled={isSaving}
          className="rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50"
        >
          Mark all read
        </button>
      </div>

      {isLoading && <p>Loading…</p>}
      {error && <p className="text-sm text-critical">{error}</p>}
      {!isLoading && !error && <NotificationList notifications={notifications ?? []} />}

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Preferences</h2>
        {prefsLoading ? (
          <p>Loading…</p>
        ) : (
          <PreferenceEditor
            preferences={preferences ?? []}
            onSave={async (next) => {
              await save(next);
            }}
            isSaving={prefsSaving}
            error={prefsError}
          />
        )}
      </section>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <ProtectedRoute requiredPermission="console:get_notification_history">
      <NotificationsContent />
    </ProtectedRoute>
  );
}
