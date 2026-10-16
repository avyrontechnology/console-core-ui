import { render, screen } from "@testing-library/react";

import EntitlementsPage from "@/app/(admin)/entitlements/page";
import GracePage from "@/app/(admin)/grace/page";
import ValidateOrderPage from "@/app/(admin)/orders/validate/page";
import { useUpdateStartDate } from "@/features/entitlements/hooks";
import { useGraceStatus, useGrantGrace } from "@/features/grace/hooks";
import { useValidateOrder } from "@/features/orders/hooks";

jest.mock("@/features/entitlements/hooks", () => ({
  useUpdateStartDate: jest.fn(),
}));

jest.mock("@/features/grace/hooks", () => ({
  useGraceStatus: jest.fn(),
  useGrantGrace: jest.fn(),
}));

jest.mock("@/features/orders/hooks", () => ({
  useOrderHistory: jest.fn(),
  useCreateManualOrder: jest.fn(),
  useValidateOrder: jest.fn(),
}));

jest.mock("@/components/ProtectedRoute", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("entitlement/grace/validate pages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("entitlements renders form", () => {
    (useUpdateStartDate as jest.Mock).mockReturnValue({
      update: jest.fn(),
      isSaving: false,
      error: null,
    });
    render(<EntitlementsPage />);
    expect(screen.getByText("Entitlements")).toBeInTheDocument();
  });

  it("grace renders lookup and grant", () => {
    (useGraceStatus as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refresh: jest.fn(),
    });
    (useGrantGrace as jest.Mock).mockReturnValue({
      grant: jest.fn(),
      isSaving: false,
      error: null,
    });
    render(<GracePage />);
    expect(screen.getByText("Grace")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /grant grace/i })).toBeInTheDocument();
  });

  it("validate renders form", () => {
    (useValidateOrder as jest.Mock).mockReturnValue({
      validate: jest.fn(),
      isSaving: false,
      error: null,
    });
    render(<ValidateOrderPage />);
    expect(screen.getByRole("heading", { name: /validate payment/i })).toBeInTheDocument();
  });
});
