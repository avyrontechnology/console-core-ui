import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ManualOrderForm } from "@/features/orders/components/ManualOrderForm";
import { OrderHistoryTable } from "@/features/orders/components/OrderHistoryTable";
import type { OrderHistoryItem } from "@/types/order";

jest.mock("@/features/orders/api", () => ({
  ordersApi: {
    history: jest.fn(),
    createManual: jest.fn(),
    billingDetails: jest.fn().mockResolvedValue({ summary: { total_payable: 1180 } }),
    calculateAmount: jest.fn(),
    initiate: jest.fn(),
    validate: jest.fn(),
  },
}));

const order: OrderHistoryItem = {
  order_id: "11111111-1111-1111-1111-111111111111",
  source: "console",
  order_status: "SUCCESS",
  order_currency: "INR",
  duration: 30,
  is_manually_created: true,
  order_type: "FRESH",
  add_ons: {},
  total_price: 1000,
  order_created_at: Date.now(),
  partner_name: "Acme",
  plan_name: "Starter",
};

describe("orders components", () => {
  it("renders history rows", () => {
    render(<OrderHistoryTable orders={[order]} />);
    expect(screen.getByText("Acme")).toBeInTheDocument();
    expect(screen.getByText("Starter")).toBeInTheDocument();
    expect(screen.getByText("SUCCESS")).toBeInTheDocument();
  });

  it("renders empty history", () => {
    render(<OrderHistoryTable orders={[]} />);
    expect(screen.getByText("No orders found")).toBeInTheDocument();
  });

  it("submits manual order form", async () => {
    const u = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<ManualOrderForm onSubmit={onSubmit} isSaving={false} serverError={null} />);
    await u.type(screen.getByLabelText("Partner ID"), "p1");
    await u.type(screen.getByLabelText("Plan ID"), "pl1");
    await u.type(screen.getByLabelText("Amount"), "1000");
    await u.clear(screen.getByLabelText("Currency"));
    await u.type(screen.getByLabelText("Currency"), "INR");
    await u.click(screen.getByRole("button", { name: /create manual order/i }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ partner_id: "p1", plan_id: "pl1" }),
    );
  });
});
