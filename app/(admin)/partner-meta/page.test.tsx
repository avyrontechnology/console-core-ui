import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PartnerMetaPage from "@/app/(admin)/partner-meta/page";
import { usePartnerMeta, useSavePartnerMeta } from "@/features/partner-meta/hooks";
import { usePartners } from "@/features/partners/hooks";

jest.mock("@/features/partner-meta/hooks", () => ({
  usePartnerMeta: jest.fn(),
  useSavePartnerMeta: jest.fn(),
}));

jest.mock("@/features/partners/hooks", () => ({
  usePartners: jest.fn(),
}));

jest.mock("@/components/ProtectedRoute", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const meta = {
  type_of_business: "Retail",
  years_in_business: 5,
  annual_revenue: 100000,
  is_talko_enabled: true,
};

describe("PartnerMetaPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("prompts for partner selection", () => {
    (usePartners as jest.Mock).mockReturnValue({ partners: [], totalCount: 0 });
    (usePartnerMeta as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
    (useSavePartnerMeta as jest.Mock).mockReturnValue({
      save: jest.fn(),
      isSaving: false,
      error: null,
    });
    render(<PartnerMetaPage />);
    expect(screen.getByText("Select a partner to view or edit business meta.")).toBeInTheDocument();
  });

  it("shows meta and saves edits", async () => {
    const u = userEvent.setup();
    const save = jest.fn().mockResolvedValue({ ...meta });
    (usePartners as jest.Mock).mockReturnValue({
      partners: [{ id: "p1", name: "Acme" }],
      totalCount: 1,
    });
    (usePartnerMeta as jest.Mock).mockReturnValue({
      data: meta,
      isLoading: false,
      error: null,
    });
    (useSavePartnerMeta as jest.Mock).mockReturnValue({
      save,
      isSaving: false,
      error: null,
    });
    render(<PartnerMetaPage />);
    await u.selectOptions(screen.getByLabelText(/partner/i), "p1");
    expect(screen.getByText("Retail")).toBeInTheDocument();
    await u.click(screen.getByRole("button", { name: /save/i }));
    expect(save).toHaveBeenCalledWith(
      "p1",
      expect.objectContaining({ type_of_business: "Retail" }),
      true,
    );
  });
});
