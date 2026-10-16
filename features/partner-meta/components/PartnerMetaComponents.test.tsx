import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  PartnerMetaForm,
  PartnerMetaSection,
} from "@/features/partner-meta/components/PartnerMetaComponents";

describe("partner-meta components", () => {
  it("renders meta section", () => {
    render(
      <PartnerMetaSection
        partnerId="p1"
        meta={{
          type_of_business: "Retail",
          years_in_business: 5,
          annual_revenue: 100,
          is_talko_enabled: true,
        }}
      />,
    );
    expect(screen.getByText("Retail")).toBeInTheDocument();
  });

  it("renders empty meta", () => {
    render(<PartnerMetaSection partnerId="p1" meta={null} />);
    expect(screen.getByText(/No meta yet/)).toBeInTheDocument();
  });

  it("submits meta form", async () => {
    const u = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<PartnerMetaForm onSubmit={onSubmit} isSaving={false} serverError={null} />);
    await u.type(screen.getByLabelText("Type of business"), "Retail");
    await u.click(screen.getByRole("button", { name: /save meta/i }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ type_of_business: "Retail" }));
  });
});
