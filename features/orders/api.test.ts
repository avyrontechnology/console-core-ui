import { ordersApi } from "@/features/orders/api";
import { consoleApi } from "@/lib/console";

jest.mock("@/lib/console", () => ({
  consoleApi: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const mocked = consoleApi as unknown as {
  get: jest.Mock;
  post: jest.Mock;
};

describe("ordersApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches history with filters", async () => {
    mocked.get.mockResolvedValue({ total_count: 0, data: [] });
    await ordersApi.history({ limit: 20, offset: 1, status: "SUCCESS" });
    expect(mocked.get).toHaveBeenCalledWith(expect.stringContaining("/orders/history"));
    expect(mocked.get).toHaveBeenCalledWith(expect.stringContaining("status=SUCCESS"));
  });

  it("creates manual order", async () => {
    mocked.post.mockResolvedValue({ order: {} });
    await ordersApi.createManual({
      partner_id: "p1",
      plan_id: "pl1",
      amount: 1000,
      payment_method: "DIRECT",
      currency: "INR",
    });
    expect(mocked.post).toHaveBeenCalledWith(
      expect.stringContaining("/orders/manual"),
      expect.objectContaining({ partner_id: "p1" }),
    );
  });

  it("posts billing details and calculates amount", async () => {
    mocked.post.mockResolvedValue({});
    mocked.get.mockResolvedValue({});
    await ordersApi.billingDetails({ plan_id: "pl1" });
    expect(mocked.post).toHaveBeenCalledWith(
      expect.stringContaining("/orders/billing-details"),
      expect.objectContaining({ plan_id: "pl1" }),
    );
    await ordersApi.calculateAmount(1000, "INR");
    expect(mocked.get).toHaveBeenCalledWith(expect.stringContaining("/orders/calculate-amount"));
  });

  it("initiates and validates orders", async () => {
    mocked.post.mockResolvedValue({ order: {} });
    await ordersApi.initiate({ plan_id: "pl1", amount: 100 });
    expect(mocked.post).toHaveBeenCalledWith(
      expect.stringContaining("/orders/initiate"),
      expect.objectContaining({ plan_id: "pl1" }),
    );
    await ordersApi.validate({ order_id: "m1", payment_id: "p1", signature: "s1" });
    expect(mocked.post).toHaveBeenCalledWith(
      expect.stringContaining("/orders/validate"),
      expect.objectContaining({ order_id: "m1" }),
    );
  });
});
