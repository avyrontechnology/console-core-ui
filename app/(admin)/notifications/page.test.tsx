import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import NotificationsPage from "@/app/(admin)/notifications/page";
import {
  useMarkNotificationsRead,
  useNotificationHistory,
  useNotificationPreferences,
  useUnreadCount,
} from "@/features/notifications/hooks";

jest.mock("@/features/notifications/hooks", () => ({
  useNotificationHistory: jest.fn(),
  useUnreadCount: jest.fn(),
  useMarkNotificationsRead: jest.fn(),
  useNotificationPreferences: jest.fn(),
}));

jest.mock("@/components/ProtectedRoute", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const history = useNotificationHistory as unknown as jest.Mock;
const unread = useUnreadCount as unknown as jest.Mock;
const mark = useMarkNotificationsRead as unknown as jest.Mock;
const prefs = useNotificationPreferences as unknown as jest.Mock;

function stubAll(overrides?: { history?: unknown }) {
  history.mockReturnValue({
    data: overrides?.history ?? [],
    count: 0,
    isLoading: false,
    error: null,
    refresh: jest.fn(),
  });
  unread.mockReturnValue({ count: 2, error: null, refresh: jest.fn() });
  mark.mockReturnValue({
    markRead: jest.fn().mockResolvedValue(undefined),
    isSaving: false,
    error: null,
  });
  prefs.mockReturnValue({
    data: [],
    isLoading: false,
    isSaving: false,
    error: null,
    save: jest.fn(),
    refresh: jest.fn(),
  });
}

describe("NotificationsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    stubAll();
  });

  it("renders history and unread badge", () => {
    stubAll({
      history: [
        {
          id: "1",
          title: "Lead assigned",
          body: "body",
          is_read: false,
          created_at: 1700000000000,
        },
      ],
    });
    render(<NotificationsPage />);
    expect(screen.getByText("2 unread")).toBeInTheDocument();
    expect(screen.getByText("Lead assigned")).toBeInTheDocument();
  });

  it("marks all read", async () => {
    const u = userEvent.setup();
    const markRead = jest.fn().mockResolvedValue(undefined);
    stubAll();
    mark.mockReturnValue({ markRead, isSaving: false, error: null });
    render(<NotificationsPage />);
    await u.click(screen.getByRole("button", { name: /mark all read/i }));
    await waitFor(() => expect(markRead).toHaveBeenCalledWith([]));
  });

  it("renders history error", () => {
    history.mockReturnValue({
      data: null,
      count: null,
      isLoading: false,
      error: "history failed",
      refresh: jest.fn(),
    });
    render(<NotificationsPage />);
    expect(screen.getByText("history failed")).toBeInTheDocument();
  });

  it("switches service type", async () => {
    const u = userEvent.setup();
    render(<NotificationsPage />);
    await u.selectOptions(screen.getByLabelText("Service"), "obotaai");
    expect(unread).toHaveBeenCalledWith("obotaai");
  });
});
