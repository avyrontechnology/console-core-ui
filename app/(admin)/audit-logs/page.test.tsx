import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AuditLogsPage from "@/app/(admin)/audit-logs/page";
import { useAuditLogs } from "@/features/audit-logs/hooks";

jest.mock("@/features/audit-logs/hooks", () => ({
  useAuditLogs: jest.fn(),
}));

jest.mock("@/components/ProtectedRoute", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mocked = useAuditLogs as unknown as jest.Mock;

describe("AuditLogsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading then rows", async () => {
    mocked.mockReturnValue({ data: null, isLoading: true, error: null, refresh: jest.fn() });
    const { rerender } = render(<AuditLogsPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    mocked.mockReturnValue({
      data: [{ id: "1", action: "DENY", resource: "AUTH", created_at: null }],
      isLoading: false,
      error: null,
      refresh: jest.fn(),
    });
    rerender(<AuditLogsPage />);
    await waitFor(() => expect(screen.getByRole("cell", { name: "DENY" })).toBeInTheDocument());
  });

  it("renders error", () => {
    mocked.mockReturnValue({ data: null, isLoading: false, error: "boom", refresh: jest.fn() });
    render(<AuditLogsPage />);
    expect(screen.getByText("boom")).toBeInTheDocument();
  });

  it("applies filters", async () => {
    const u = userEvent.setup();
    const refresh = jest.fn().mockResolvedValue(undefined);
    mocked.mockReturnValue({ data: [], isLoading: false, error: null, refresh });
    render(<AuditLogsPage />);
    await u.selectOptions(screen.getByLabelText("Resource"), "AUTH");
    await u.selectOptions(screen.getByLabelText("Action"), "DENY");
    await u.click(screen.getByRole("button", { name: /apply filters/i }));
    await waitFor(() => expect(refresh).toHaveBeenCalled());
  });
});
