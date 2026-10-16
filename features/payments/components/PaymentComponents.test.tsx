import { render, screen } from "@testing-library/react";

import { PaymentHistoryTable } from "@/features/payments/components/PaymentHistoryTable";

describe("payments components", () => {
  it("renders rows", () => {
    render(
      <PaymentHistoryTable
        rows={[{ id: "pay1", status: "SUCCESS", amount: 100, currency: "INR" }]}
      />,
    );
    expect(screen.getByText("pay1")).toBeInTheDocument();
    expect(screen.getByText("SUCCESS")).toBeInTheDocument();
  });

  it("renders empty", () => {
    render(<PaymentHistoryTable rows={[]} />);
    expect(screen.getByText("No payments found")).toBeInTheDocument();
  });
});
