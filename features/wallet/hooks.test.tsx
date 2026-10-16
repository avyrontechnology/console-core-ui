import { renderHook, waitFor } from "@testing-library/react";

import { walletApi } from "@/features/wallet/api";
import { useWallet, useWalletTransactions } from "@/features/wallet/hooks";

jest.mock("@/features/wallet/api", () => ({
  walletApi: {
    get: jest.fn(),
    transactions: jest.fn(),
  },
}));

const mocked = walletApi as unknown as Record<string, jest.Mock>;

describe("wallet hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("useWallet loads balance", async () => {
    mocked.get.mockResolvedValue({ partner_id: "p1", balance: 100 });
    const { result } = renderHook(() => useWallet());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.balance).toBe(100);
  });

  it("useWalletTransactions loads list", async () => {
    mocked.transactions.mockResolvedValue({ total_count: 0, transactions: [] });
    const { result } = renderHook(() => useWalletTransactions({ limit: 20, offset: 1 }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.total_count).toBe(0);
  });
});
