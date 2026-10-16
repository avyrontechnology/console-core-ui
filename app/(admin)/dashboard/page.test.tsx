import { render, screen } from "@testing-library/react";

import DashboardPage from "@/app/(admin)/dashboard/page";
import { DashboardCards } from "@/features/dashboard/components/DashboardCards";
import { useDashboardCards } from "@/features/dashboard/hooks";

jest.mock("@/features/dashboard/hooks", () => ({
  useDashboardCards: jest.fn(),
}));

jest.mock("@/components/ProtectedRoute", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: { name: "Alice" },
      partnerInfo: { partner_name: "Acme" },
    },
    status: "authenticated",
  }),
}));

describe("DashboardCards", () => {
  it("renders counts and empty state", () => {
    const { unmount } = render(
      <DashboardCards cards={[{ title: "Total", key: null, count: 7 }]} />,
    );
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    unmount();
    render(<DashboardCards cards={[]} />);
    expect(screen.getByText(/no dashboard data/i)).toBeInTheDocument();
  });
});

describe("DashboardPage", () => {
  it("greets user and shows cards", () => {
    (useDashboardCards as jest.Mock).mockReturnValue({
      data: [{ title: "Total", key: null, count: 7 }],
      isLoading: false,
      error: null,
    });
    render(<DashboardPage />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText(/hello,/i)).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("shows loading and error states", () => {
    (useDashboardCards as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });
    const { unmount } = render(<DashboardPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    unmount();
    (useDashboardCards as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: "down",
    });
    render(<DashboardPage />);
    expect(screen.getByText("down")).toBeInTheDocument();
  });
});
