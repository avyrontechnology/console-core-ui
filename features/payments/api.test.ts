import { paymentsApi } from "@/features/payments/api";
import { consoleApi } from "@/lib/console";

jest.mock("@/lib/console", () => ({
  consoleApi: {
    get: jest.fn(),
  },
}));

const mocked = consoleApi as unknown as {
  get: jest.Mock;
};

describe("paymentsApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches history", async () => {
    mocked.get.mockResolvedValue({ total_count: 0, data: [] });
    await paymentsApi.history({ limit: 20, offset: 1 });
    expect(mocked.get).toHaveBeenCalledWith(expect.stringContaining("/payment/history"));
  });
});
