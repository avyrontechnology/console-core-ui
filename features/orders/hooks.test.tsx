import { renderHook, waitFor } from "@testing-library/react";

import { ordersApi } from "@/features/orders/api";
import { useCreateManualOrder, useOrderHistory, useValidateOrder } from "@/features/orders/hooks";

jest.mock("@/features/orders/api", () => ({
  ordersApi: {
    history: jest.fn(),
    createManual: jest.fn(),
    billingDetails: jest.fn(),
    calculateAmount: jest.fn(),
    initiate: jest.fn(),
    validate: jest.fn(),
  },
}));

const mocked = ordersApi as unknown as Record<string, jest.Mock>;

describe("orders hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("useOrderHistory loads list", async () => {
    mocked.history.mockResolvedValue({ total_count: 1, data: [{ order_id: "o1" }] });
    const { result } = renderHook(() => useOrderHistory({ limit: 20, offset: 1 }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.total_count).toBe(1);
  });

  it("useOrderHistory surfaces error", async () => {
    mocked.history.mockRejectedValue(new Error("down"));
    const { result } = renderHook(() => useOrderHistory());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe("down");
  });

  it("useCreateManualOrder creates", async () => {
    mocked.createManual.mockResolvedValue({ order: { id: "o9" } });
    const { result } = renderHook(() => useCreateManualOrder());
    const { act } = await import("@testing-library/react");
    let out: unknown;
    await act(async () => {
      out = await result.current.create({
        partner_id: "p1",
        plan_id: "pl1",
        amount: 500,
        payment_method: "DIRECT",
      });
    });
    expect(out).toEqual({ order: { id: "o9" } });
  });

  it("useValidateOrder validates", async () => {
    mocked.validate.mockResolvedValue({ status: "SUCCESS" });
    const { result } = renderHook(() => useValidateOrder());
    const { act } = await import("@testing-library/react");
    let out: unknown;
    await act(async () => {
      out = await result.current.validate({ order_id: "m1", payment_id: "p1", signature: "s" });
    });
    expect(out).toEqual({ status: "SUCCESS" });
  });
});
