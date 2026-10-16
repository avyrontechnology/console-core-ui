import { walletApi } from "@/features/wallet/api";
import { consoleApi } from "@/lib/console";

jest.mock("@/lib/console", () => ({
  consoleApi: {
    get: jest.fn(),
  },
}));

const mocked = consoleApi as unknown as {
  get: jest.Mock;
};

describe("walletApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches wallet", async () => {
    mocked.get.mockResolvedValue({ partner_id: "p1" });
    await walletApi.get();
    expect(mocked.get).toHaveBeenCalledWith(expect.stringContaining("/wallet"));
  });

  it("fetches transactions with paging", async () => {
    mocked.get.mockResolvedValue({ total_count: 0, transactions: [] });
    await walletApi.transactions({ limit: 20, offset: 1 });
    expect(mocked.get).toHaveBeenCalledWith(expect.stringContaining("/wallet/transactions"));
    expect(mocked.get).toHaveBeenCalledWith(expect.stringContaining("limit=20"));
  });
});
