import { dashboardApi } from "@/features/dashboard/api";
import { consoleApi } from "@/lib/console";

jest.mock("@/lib/console", () => ({
  consoleApi: { get: jest.fn() },
}));

const mocked = consoleApi as unknown as { get: jest.Mock };

describe("dashboardApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches cards", async () => {
    mocked.get.mockResolvedValue([{ title: "Total", key: null, count: 5 }]);
    await expect(dashboardApi.cards()).resolves.toEqual([{ title: "Total", key: null, count: 5 }]);
    expect(mocked.get).toHaveBeenCalledWith(expect.stringContaining("/partner_dashboard_cards"));
  });
});
