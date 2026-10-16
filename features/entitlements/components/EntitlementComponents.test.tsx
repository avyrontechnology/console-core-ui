import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { UpdateStartDateForm } from "@/features/entitlements/components/UpdateStartDateForm";

describe("entitlements components", () => {
  it("submits start date form", async () => {
    const u = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<UpdateStartDateForm onSubmit={onSubmit} isSaving={false} serverError={null} />);
    await u.type(screen.getByLabelText("Order ID"), "o1");
    await u.type(screen.getByLabelText(/Start date/), "1700000000000");
    await u.click(screen.getByRole("button", { name: /update start date/i }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ order_id: "o1", start_date: 1700000000000 }),
    );
  });
});
