import { notificationsApi } from "@/features/notifications/api";
import { consoleApi } from "@/lib/console";

jest.mock("@/lib/console", () => ({
  consoleApi: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mocked = consoleApi as unknown as {
  get: jest.Mock;
  post: jest.Mock;
  patch: jest.Mock;
  delete: jest.Mock;
};

describe("notificationsApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("gets preferences", async () => {
    mocked.get.mockResolvedValue({ preferences: [] });
    await notificationsApi.getPreferences();
    expect(mocked.get).toHaveBeenCalledWith(expect.stringContaining("/notification/preferences"));
  });

  it("updates preferences", async () => {
    mocked.patch.mockResolvedValue({ preferences: [] });
    await notificationsApi.updatePreferences([{ source: "talko", scope: "all", state: "enabled" }]);
    expect(mocked.patch).toHaveBeenCalledWith(
      expect.stringContaining("/notification/preferences"),
      { preferences: [{ source: "talko", scope: "all", state: "enabled" }] },
    );
  });

  it("reads history with filters", async () => {
    mocked.get.mockResolvedValue({ notifications: [], count: 0 });
    await notificationsApi.history({ service_type: "talko", limit: 50, offset: 0 });
    const url: string = mocked.get.mock.calls[0][0] as string;
    expect(url).toContain("/notifications/history");
    expect(url).toContain("service_type=talko");
    expect(url).toContain("limit=50");
  });

  it("reads unread count", async () => {
    mocked.get.mockResolvedValue({ unread_count: 3 });
    const result = await notificationsApi.unreadCount("talko");
    expect(result.unread_count).toBe(3);
    expect(mocked.get.mock.calls[0][0]).toContain("service_type=talko");
  });

  it("marks specific ids read", async () => {
    mocked.patch.mockResolvedValue("ok");
    await notificationsApi.markRead([
      "11111111-1111-1111-1111-111111111111",
      "22222222-2222-2222-2222-222222222222",
    ]);
    expect(mocked.patch).toHaveBeenCalledWith(expect.stringContaining("/notifications/read"), {
      notification_ids: [
        "11111111-1111-1111-1111-111111111111",
        "22222222-2222-2222-2222-222222222222",
      ],
    });
  });

  it("marks all read with empty array", async () => {
    mocked.patch.mockResolvedValue("ok");
    await notificationsApi.markRead();
    expect(mocked.patch.mock.calls[0][1]).toEqual({ notification_ids: [] });
  });

  it("subscribes and unsubscribes", async () => {
    mocked.post.mockResolvedValue({});
    await notificationsApi.subscribe({
      channel_type: "FCM",
      identifier: "device-token",
      service_type: "talko",
    });
    expect(mocked.post).toHaveBeenCalledWith(
      expect.stringContaining("/notifications/subscribe"),
      expect.objectContaining({ channel_type: "FCM" }),
    );

    mocked.delete.mockResolvedValue({});
    await notificationsApi.unsubscribe("device-token", "talko");
    const url: string = mocked.delete.mock.calls[0][0] as string;
    expect(url).toContain("/notifications/unsubscribe");
    expect(url).toContain("identifier=device-token");
    expect(url).toContain("service_type=talko");
  });
});
