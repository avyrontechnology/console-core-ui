import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { GraceStatusCard, GrantGraceForm } from "@/features/grace/components/GraceComponents";

describe("grace components", () => {
  it("renders status card", () => {
    render(
      <GraceStatusCard
        status={{
          partner_id: "p1",
          service_name: "console",
          has_active_grace: true,
          total_attempts_used: 1,
          attempts_remaining: 2,
          total_consumed_days: 5,
        }}
      />,
    );
    expect(screen.getByText(/Active grace/)).toBeInTheDocument();
  });

  it("submits grant form", async () => {
    const u = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<GrantGraceForm onSubmit={onSubmit} isSaving={false} serverError={null} />);
    await u.type(screen.getByLabelText("Partner ID"), "p1");
    await u.type(screen.getByLabelText("Granted days"), "7");
    await u.type(screen.getByLabelText("Remark"), "need time");
    await u.click(screen.getByRole("button", { name: /grant grace/i }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ partner_id: "p1", granted_days: 7 }),
    );
  });
});
