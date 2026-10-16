import { entitlementsApi } from "@/features/entitlements/api";
import { consoleApi } from "@/lib/console";

jest.mock("@/lib/console", () => ({
  consoleApi: {
    patch: jest.fn(),
  },
}));

const mocked = consoleApi as unknown as {
  patch: jest.Mock;
};

describe("entitlementsApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updates start date", async () => {
    mocked.patch.mockResolvedValue([]);
    await entitlementsApi.updateStartDate({ order_id: "o1", start_date: 1700000000000 });
    expect(mocked.patch).toHaveBeenCalledWith(
      expect.stringContaining("/entitlements/update-start-date"),
      expect.objectContaining({ order_id: "o1" }),
    );
  });

  it("dismisses popup", async () => {
    mocked.patch.mockResolvedValue({});
    await entitlementsApi.dismissPopup("console");
    expect(mocked.patch).toHaveBeenCalledWith(
      expect.stringContaining("/entitlements/dismiss-popup"),
    );
  });
});
