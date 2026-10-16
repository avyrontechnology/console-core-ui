import { render, screen } from "@testing-library/react";

import {
  WalletOverview,
  WalletTransactionTable,
} from "@/features/wallet/components/WalletComponents";

describe("wallet components", () => {
  it("renders balances", () => {
    render(
      <WalletOverview
        wallet={{ partner_id: "p1", balance: 1000, frozen_balance: 100, currency: "INR" }}
      />,
    );
    expect(screen.getByText(/1000 INR/)).toBeInTheDocument();
  });

  it("renders transactions", () => {
    render(
      <WalletTransactionTable
        transactions={[
          {
            id: "t1",
            wallet_id: "w1",
            transaction_type: "CREDIT",
            service_name: "Talko",
            previous_balance: 0,
            amount: 500,
            remaining_balance: 500,
            status: "SUCCESS",
            created_at: Date.now(),
          },
        ]}
      />,
    );
    expect(screen.getByText("Talko")).toBeInTheDocument();
    expect(screen.getByText("CREDIT")).toBeInTheDocument();
  });

  it("renders empty transactions", () => {
    render(<WalletTransactionTable transactions={[]} />);
    expect(screen.getByText("No transactions found")).toBeInTheDocument();
  });
});
