import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import UserConfigsPage from "@/app/(admin)/user-configs/page";
import { useUserConfigs } from "@/features/user-configs/hooks";

jest.mock("@/features/user-configs/hooks", () => ({
  useUserConfigs: jest.fn(),
}));

jest.mock("@/components/ProtectedRoute", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mocked = useUserConfigs as unknown as jest.Mock;

function stub(overrides?: { save?: jest.Mock }) {
  mocked.mockReturnValue({
    data: [{ key: "is_talko_enabled", value: true }],
    flags: { is_talko_enabled: true },
    isLoading: false,
    isSaving: false,
    error: null,
    save: overrides?.save ?? jest.fn().mockResolvedValue([]),
    refresh: jest.fn().mockResolvedValue(undefined),
  });
}

const P = "11111111-1111-1111-1111-111111111111";
const U = "22222222-2222-2222-2222-222222222222";

describe("UserConfigsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    stub();
  });

  it("renders loaded configs", () => {
    render(<UserConfigsPage />);
    expect(screen.getByText("1 config entries")).toBeInTheDocument();
    expect(screen.getByLabelText("Is Talko Enabled")).toBeChecked();
  });

  it("saves a toggle with partner and target ids", async () => {
    const u = userEvent.setup();
    const save = jest.fn().mockResolvedValue([]);
    stub({ save });
    render(<UserConfigsPage />);
    await u.type(screen.getByLabelText("Partner ID"), P);
    await u.type(screen.getByLabelText("Target user IDs"), U);
    await u.click(screen.getByLabelText("Is Talko Enabled"));
    await waitFor(() => expect(save).toHaveBeenCalledWith(P, [U], { is_talko_enabled: false }));
  });

  it("does not save without partner and target ids", async () => {
    const u = userEvent.setup();
    const save = jest.fn().mockResolvedValue([]);
    stub({ save });
    render(<UserConfigsPage />);
    await u.click(screen.getByLabelText("Enable Dialer"));
    expect(save).not.toHaveBeenCalled();
  });

  it("renders error state", () => {
    mocked.mockReturnValue({
      data: null,
      flags: {},
      isLoading: true,
      isSaving: false,
      error: "boom",
      save: jest.fn(),
      refresh: jest.fn(),
    });
    render(<UserConfigsPage />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
    expect(screen.getByText("boom")).toBeInTheDocument();
  });

  it("reloads with an explicit user id", async () => {
    const u = userEvent.setup();
    render(<UserConfigsPage />);
    await u.type(screen.getByLabelText("User ID"), U);
    await u.click(screen.getByRole("button", { name: "Load" }));
    await waitFor(() => expect(mocked).toHaveBeenLastCalledWith(U));
  });
});
