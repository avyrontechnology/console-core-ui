import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ApiKeysPage from "@/app/(admin)/api-keys/page";
import { useApiKey, useInactivateKey, useRotateKey, useUpdateKey } from "@/features/api-keys/hooks";

jest.mock("@/features/api-keys/hooks", () => ({
  useApiKey: jest.fn(),
  useInactivateKey: jest.fn(),
  useRotateKey: jest.fn(),
  useUpdateKey: jest.fn(),
}));

jest.mock("@/components/ProtectedRoute", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const key = {
  id: "1",
  key: "abcd1234efgh5678",
  scopes: ["console:get_all_users"],
  is_active: true,
  expires_at: null,
  partner_id: "p1",
};

describe("ApiKeysPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useApiKey as jest.Mock).mockReturnValue({
      data: key,
      isLoading: false,
      error: null,
      refresh: jest.fn(),
    });
    (useRotateKey as jest.Mock).mockReturnValue({
      rotate: jest.fn(),
      isSaving: false,
      error: null,
    });
    (useUpdateKey as jest.Mock).mockReturnValue({
      update: jest.fn(),
      isSaving: false,
      error: null,
    });
    (useInactivateKey as jest.Mock).mockReturnValue({
      inactivate: jest.fn(),
      isSaving: false,
      error: null,
    });
  });

  it("masks key and reveals on demand", async () => {
    const u = userEvent.setup();
    render(<ApiKeysPage />);
    expect(screen.queryByText("abcd1234efgh5678")).not.toBeInTheDocument();
    await u.click(screen.getByRole("button", { name: /reveal/i }));
    expect(screen.getByText("abcd1234efgh5678")).toBeInTheDocument();
  });

  it("copies key to clipboard", async () => {
    const u = userEvent.setup();
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    render(<ApiKeysPage />);
    await u.click(screen.getByRole("button", { name: /copy/i }));
    expect(writeText).toHaveBeenCalledWith("abcd1234efgh5678");
  });

  it("rotates after confirm", async () => {
    const u = userEvent.setup();
    const rotate = jest.fn().mockResolvedValue({ ...key, id: "2" });
    (useRotateKey as jest.Mock).mockReturnValue({
      rotate,
      isSaving: false,
      error: null,
    });
    render(<ApiKeysPage />);
    await u.click(screen.getByRole("button", { name: /^rotate key$/i }));
    await u.click(screen.getByRole("button", { name: /^rotate$/i }));
    expect(rotate).toHaveBeenCalled();
  });

  it("saves scopes", async () => {
    const u = userEvent.setup();
    const update = jest.fn().mockResolvedValue(key);
    (useUpdateKey as jest.Mock).mockReturnValue({
      update,
      isSaving: false,
      error: null,
    });
    render(<ApiKeysPage />);
    const box = screen.getByRole("textbox");
    await u.clear(box);
    await u.type(box, "console:get_all_users");
    await u.click(screen.getByRole("button", { name: /save scopes/i }));
    expect(update).toHaveBeenCalledWith({
      scopes: ["console:get_all_users"],
    });
  });
});
