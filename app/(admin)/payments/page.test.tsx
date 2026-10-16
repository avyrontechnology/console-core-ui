import { render, screen } from "@testing-library/react";

import PaymentsPage from "@/app/(admin)/payments/page";
import { usePaymentHistory } from "@/features/payments/hooks";

jest.mock("@/features/payments/hooks", () => ({
  usePaymentHistory: jest.fn(),
}));

jest.mock("@/components/ProtectedRoute", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("payments page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders history", () => {
    (usePaymentHistory as jest.Mock).mockReturnValue({
      data: {
        total_count: 1,
        data: [{ id: "pay1", status: "SUCCESS", amount: 100 }],
      },
      isLoading: false,
      error: null,
      refresh: jest.fn(),
    });
    render(<PaymentsPage />);
    expect(screen.getByText("Payments")).toBeInTheDocument();
    expect(screen.getByText("pay1")).toBeInTheDocument();
  });
});
