import { act, renderHook, waitFor } from "@testing-library/react";

import { dashboardApi } from "@/features/dashboard/api";
import { useDashboardCards } from "@/features/dashboard/hooks";

jest.mock("@/features/dashboard/api", () => ({
  dashboardApi: { cards: jest.fn() },
}));

const mocked = dashboardApi as unknown as Record<string, jest.Mock>;

describe("useDashboardCards", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads cards", async () => {
    mocked.cards.mockResolvedValue([{ title: "T", key: null, count: 1 }]);
    const { result } = renderHook(() => useDashboardCards());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual([{ title: "T", key: null, count: 1 }]);
  });

  it("refreshes on demand", async () => {
    mocked.cards
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ title: "T", key: null, count: 2 }]);
    const { result } = renderHook(() => useDashboardCards());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.refresh();
    });
    expect(result.current.data).toEqual([{ title: "T", key: null, count: 2 }]);
  });

  it("surfaces errors", async () => {
    mocked.cards.mockRejectedValue(new Error("down"));
    const { result } = renderHook(() => useDashboardCards());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe("down");
  });
});
