import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PlanForm } from "@/features/plans/components/PlanForm";
import { PlanTable } from "@/features/plans/components/PlanTable";
import type { Plan } from "@/types/plan";

const plans: Plan[] = [
  {
    id: "1",
    name: "Starter",
    currency: "INR",
    duration: 30,
    modules: [],
    plan_type: "standard",
    is_active: true,
    price: 999,
  },
];

describe("PlanTable", () => {
  it("renders rows and empty state", () => {
    const { unmount } = render(<PlanTable plans={plans} />);
    expect(screen.getByText("Starter")).toBeInTheDocument();
    expect(screen.getByText("999 INR")).toBeInTheDocument();
    unmount();
    render(<PlanTable plans={[]} />);
    expect(screen.getByText(/no plans found/i)).toBeInTheDocument();
  });
});

describe("PlanForm", () => {
  it("requires core fields", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(
      <PlanForm availableModules={[]} onSubmit={onSubmit} isSaving={false} serverError={null} />,
    );
    await user.click(screen.getByRole("button", { name: /create plan/i }));
    expect(await screen.findAllByText(/required/i)).not.toHaveLength(0);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits valid values with modules", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(
      <PlanForm
        availableModules={["dashboard", "analytics"]}
        onSubmit={onSubmit}
        isSaving={false}
        serverError={null}
      />,
    );
    await user.type(screen.getByLabelText(/^name/i), "Starter");
    await user.type(screen.getByLabelText(/^tag/i), "starter");
    await user.type(screen.getByLabelText(/service name/i), "console");
    await user.type(screen.getByLabelText(/currency/i), "INR");
    await user.type(screen.getByLabelText(/duration/i), "30");
    await user.type(screen.getByLabelText(/hierarchy/i), "4");
    await user.click(screen.getByLabelText("dashboard"));
    await user.click(screen.getByRole("button", { name: /create plan/i }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Starter",
        duration: 30,
        modules: ["dashboard"],
      }),
    );
  });
});
