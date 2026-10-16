import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { BillingPreview } from "@/features/orders/components/BillingPreview";
import { ValidateOrderForm } from "@/features/orders/components/ValidateOrderForm";
import { ordersApi } from "@/features/orders/api";

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

describe("billing + validate components", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders billing total", async () => {
    mocked.billingDetails.mockResolvedValue({ summary: { total_payable: 1180 } });
    render(<BillingPreview planId="pl1" />);
    await waitFor(() => expect(screen.getByText(/Total payable: 1180/)).toBeInTheDocument());
  });

  it("renders billing error", async () => {
    mocked.billingDetails.mockRejectedValue(new Error("nope"));
    render(<BillingPreview planId="pl1" />);
    await waitFor(() => expect(screen.getByText("nope")).toBeInTheDocument());
  });

  it("submits validate form", async () => {
    const u = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<ValidateOrderForm onSubmit={onSubmit} isSaving={false} serverError={null} />);
    await u.type(screen.getByLabelText("Gateway order id"), "m1");
    await u.type(screen.getByLabelText("Payment id"), "pay1");
    await u.type(screen.getByLabelText("Signature"), "sig1");
    await u.click(screen.getByRole("button", { name: /validate payment/i }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ order_id: "m1", payment_id: "pay1" }),
    );
  });
});
