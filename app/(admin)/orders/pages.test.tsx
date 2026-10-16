import { render, screen } from "@testing-library/react";

import OrdersPage from "@/app/(admin)/orders/page";
import NewManualOrderPage from "@/app/(admin)/orders/new/page";
import WalletPage from "@/app/(admin)/wallet/page";
import { useCreateManualOrder, useOrderHistory } from "@/features/orders/hooks";
import { useWallet, useWalletTransactions } from "@/features/wallet/hooks";

jest.mock("@/features/orders/hooks", () => ({
  useOrderHistory: jest.fn(),
  useCreateManualOrder: jest.fn(),
  useValidateOrder: jest.fn(),
}));

jest.mock("@/features/orders/api", () => ({
  ordersApi: {
    history: jest.fn(),
    createManual: jest.fn(),
    billingDetails: jest.fn().mockResolvedValue({ summary: { total_payable: 1 } }),
    calculateAmount: jest.fn(),
    initiate: jest.fn(),
    validate: jest.fn(),
  },
}));

jest.mock("@/features/wallet/hooks", () => ({
  useWallet: jest.fn(),
  useWalletTransactions: jest.fn(),
}));

jest.mock("@/components/ProtectedRoute", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("orders/wallet pages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("orders list renders rows", () => {
    (useOrderHistory as jest.Mock).mockReturnValue({
      data: {
        total_count: 1,
        data: [
          {
            order_id: "o1",
            source: "console",
            order_status: "SUCCESS",
            order_currency: "INR",
            duration: 30,
            is_manually_created: true,
            order_type: "FRESH",
            add_ons: {},
            total_price: 100,
            order_created_at: Date.now(),
            partner_name: "Acme",
            plan_name: "Starter",
          },
        ],
      },
      isLoading: false,
      error: null,
      refresh: jest.fn(),
    });
    render(<OrdersPage />);
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("Acme")).toBeInTheDocument();
  });

  it("new manual order renders form", () => {
    (useCreateManualOrder as jest.Mock).mockReturnValue({
      create: jest.fn(),
      isSaving: false,
      error: null,
    });
    render(<NewManualOrderPage />);
    expect(screen.getByText("New manual order")).toBeInTheDocument();
  });

  it("wallet renders balances and transactions", () => {
    (useWallet as jest.Mock).mockReturnValue({
      data: { partner_id: "p1", balance: 500, frozen_balance: 0, currency: "INR" },
      isLoading: false,
      error: null,
      refresh: jest.fn(),
    });
    (useWalletTransactions as jest.Mock).mockReturnValue({
      data: { total_count: 0, transactions: [] },
      isLoading: false,
      error: null,
      refresh: jest.fn(),
    });
    render(<WalletPage />);
    expect(screen.getByText("Wallet")).toBeInTheDocument();
  });
});
