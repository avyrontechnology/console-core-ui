import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PartnerForm } from "@/features/partners/components/PartnerForm";
import { PartnerTable } from "@/features/partners/components/PartnerTable";
import type { Partner } from "@/types/partner";

const partners: Partner[] = [
  {
    id: "1",
    name: "Acme",
    company_legal_name: "Acme Corp",
    is_active: true,
  },
];

describe("PartnerTable", () => {
  it("renders rows and empty state", () => {
    const { unmount } = render(<PartnerTable partners={partners} />);
    expect(screen.getByText("Acme")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    unmount();
    render(<PartnerTable partners={[]} />);
    expect(screen.getByText(/no partners found/i)).toBeInTheDocument();
  });
});

describe("PartnerForm", () => {
  it("validates GST format", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<PartnerForm onSubmit={onSubmit} isSaving={false} serverError={null} />);
    await user.type(screen.getByLabelText(/^name$/i), "Acme");
    await user.type(screen.getByLabelText(/company legal name/i), "Acme Corp");
    await user.type(screen.getByLabelText(/gst number/i), "bad");
    await user.click(screen.getByRole("button", { name: /create partner/i }));
    expect(await screen.findByText(/invalid gst/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits valid values", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<PartnerForm onSubmit={onSubmit} isSaving={false} serverError={null} />);
    await user.type(screen.getByLabelText(/^name/i), "Acme");
    await user.type(screen.getByLabelText(/company legal name/i), "Acme Corp");
    await user.click(screen.getByRole("button", { name: /create partner/i }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: "Acme" }));
  });
});
