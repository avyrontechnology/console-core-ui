import { renderHook, waitFor } from "@testing-library/react";

import { paymentsApi } from "@/features/payments/api";
import { usePaymentHistory } from "@/features/payments/hooks";

jest.mock("@/features/payments/api", () => ({
  paymentsApi: {
    history: jest.fn(),
  },
}));

const mocked = paymentsApi as unknown as Record<string, jest.Mock>;

describe("payments hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads history", async () => {
    mocked.history.mockResolvedValue({ total_count: 2, data: [] });
    const { result } = renderHook(() => usePaymentHistory(20, 1));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.total_count).toBe(2);
  });
});
