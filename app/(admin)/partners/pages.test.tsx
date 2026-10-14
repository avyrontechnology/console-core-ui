import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import NewPartnerPage from "@/app/(admin)/partners/new/page";
import PartnerDetailPage from "@/app/(admin)/partners/[id]/page";
import PartnersPage from "@/app/(admin)/partners/page";
import {
  useCreatePartner,
  useDeletePartner,
  usePartner,
  usePartners,
  useTogglePartnerActivation,
  useUpdatePartner,
} from "@/features/partners/hooks";

jest.mock("@/features/partners/hooks", () => ({
  useCreatePartner: jest.fn(),
  useDeletePartner: jest.fn(),
  usePartner: jest.fn(),
  usePartners: jest.fn(),
  useTogglePartnerActivation: jest.fn(),
  useUpdatePartner: jest.fn(),
}));

jest.mock("@/components/ProtectedRoute", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  useParams: () => ({ id: "1" }),
}));

const partner = {
  id: "1",
  name: "Acme",
  company_legal_name: "Acme Corp",
  is_active: true,
  active_license: 3,
};

describe("partner pages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("list renders rows", () => {
    (usePartners as jest.Mock).mockReturnValue({
      data: [partner],
      isLoading: false,
      error: null,
    });
    render(<PartnersPage />);
    expect(screen.getByText("Acme")).toBeInTheDocument();
  });

  it("new submits form", async () => {
    const u = userEvent.setup();
    const create = jest.fn().mockResolvedValue({ id: "9" });
    (useCreatePartner as jest.Mock).mockReturnValue({
      create,
      isSaving: false,
      error: null,
    });
    render(<NewPartnerPage />);
    await u.type(screen.getByLabelText(/^name/i), "Acme");
    await u.type(screen.getByLabelText(/company legal name/i), "Acme Corp");
    await u.click(screen.getByRole("button", { name: /create partner/i }));
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ name: "Acme" }));
  });

  it("detail saves, toggles and deletes", async () => {
    const u = userEvent.setup();
    const update = jest.fn().mockResolvedValue(partner);
    const remove = jest.fn().mockResolvedValue(undefined);
    const toggle = jest.fn().mockResolvedValue({ ...partner, is_active: false });
    (usePartner as jest.Mock).mockReturnValue({
      data: partner,
      isLoading: false,
      error: null,
    });
    (useUpdatePartner as jest.Mock).mockReturnValue({
      update,
      isSaving: false,
      error: null,
    });
    (useDeletePartner as jest.Mock).mockReturnValue({
      remove,
      isSaving: false,
      error: null,
    });
    (useTogglePartnerActivation as jest.Mock).mockReturnValue({
      toggle,
      isSaving: false,
      error: null,
    });
    render(<PartnerDetailPage />);
    await u.clear(screen.getByLabelText(/name/i));
    await u.type(screen.getByLabelText(/name/i), "Acme2");
    await u.click(screen.getByRole("button", { name: /^save$/i }));
    expect(update).toHaveBeenCalledWith("1", expect.objectContaining({ name: "Acme2" }));

    await u.click(screen.getByRole("button", { name: /^deactivate$/i }));
    expect(toggle).toHaveBeenCalledWith("1", false);

    await u.click(screen.getAllByRole("button", { name: /^delete$/i })[0]);
    await u.click(screen.getAllByRole("button", { name: /^delete$/i })[1]);
    expect(remove).toHaveBeenCalledWith("1");
  });
});
