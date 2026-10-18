import { act, renderHook, waitFor } from "@testing-library/react";

import { notificationsApi } from "@/features/notifications/api";
import {
  useMarkNotificationsRead,
  useNotificationHistory,
  useNotificationPreferences,
  useUnreadCount,
} from "@/features/notifications/hooks";

jest.mock("@/features/notifications/api", () => ({
  notificationsApi: {
    history: jest.fn(),
    unreadCount: jest.fn(),
    markRead: jest.fn(),
    getPreferences: jest.fn(),
    updatePreferences: jest.fn(),
  },
}));

const mocked = notificationsApi as unknown as Record<string, jest.Mock>;

describe("notifications hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("useNotificationHistory loads and refreshes", async () => {
    mocked.history.mockResolvedValue({ notifications: [{ id: "1", title: "t" }], count: 1 });
    const { result } = renderHook(() =>
      useNotificationHistory({ service_type: "talko", limit: 50 }),
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.count).toBe(1);
    mocked.history.mockResolvedValue({ notifications: [], count: 0 });
    await act(async () => {
      await result.current.refresh();
    });
    expect(result.current.data).toEqual([]);
  });

  it("useNotificationHistory surfaces errors", async () => {
    mocked.history.mockRejectedValue(new Error("nope"));
    const { result } = renderHook(() => useNotificationHistory());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe("nope");
  });

  it("useUnreadCount loads", async () => {
    mocked.unreadCount.mockResolvedValue({ unread_count: 7 });
    const { result } = renderHook(() => useUnreadCount("talko"));
    await waitFor(() => expect(result.current.count).toBe(7));
  });

  it("useMarkNotificationsRead marks all by default", async () => {
    mocked.markRead.mockResolvedValue("ok");
    const { result } = renderHook(() => useMarkNotificationsRead());
    await act(async () => {
      await result.current.markRead();
    });
    expect(mocked.markRead).toHaveBeenCalledWith([]);
    expect(result.current.isSaving).toBe(false);
  });

  it("useMarkNotificationsRead exposes errors", async () => {
    mocked.markRead.mockRejectedValue(new Error("fail"));
    const { result } = renderHook(() => useMarkNotificationsRead());
    await act(async () => {
      await expect(result.current.markRead([1])).rejects.toThrow("fail");
    });
    expect(result.current.error).toBe("fail");
  });

  it("useNotificationPreferences loads and saves", async () => {
    mocked.getPreferences.mockResolvedValue({
      user_id: "u1",
      preferences: [{ source: "talko", scope: "all", state: "enabled" }],
    });
    mocked.updatePreferences.mockResolvedValue({
      user_id: "u1",
      preferences: [{ source: "talko", scope: "all", state: "disabled" }],
    });
    const { result } = renderHook(() => useNotificationPreferences());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toHaveLength(1);
    let saved: unknown;
    await act(async () => {
      saved = await result.current.save([{ source: "talko", scope: "all", state: "disabled" }]);
    });
    expect(saved).toEqual([{ source: "talko", scope: "all", state: "disabled" }]);
  });
});
