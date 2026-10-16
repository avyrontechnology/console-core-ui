import { render, screen } from "@testing-library/react";

import RootLayout from "@/app/layout";
import Home from "@/app/page";
import StoreProvider from "@/app/StoreProvider";
import AdminLayout from "@/app/(admin)/layout";
import DashboardPage from "@/app/(admin)/dashboard/page";
import LoginPage from "@/app/login/page";

jest.mock("next-auth/react", () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSession: () => ({ data: null, status: "unauthenticated" }),
  signIn: jest.fn(),
}));

jest.mock("@/components/ProtectedRoute", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/features/dashboard/hooks", () => ({
  useHomepageDetails: () => ({ data: null, isLoading: false, error: null, refresh: jest.fn() }),
  useDashboardCards: () => ({ data: [], isLoading: false, error: null, refresh: jest.fn() }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("app shell", () => {
  it("root layout renders children", () => {
    render(
      <RootLayout>
        <p>hello</p>
      </RootLayout>,
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("home renders product name", () => {
    render(<Home />);
    expect(screen.getByText("Console Core")).toBeInTheDocument();
  });

  it("store provider supplies redux store", () => {
    render(
      <StoreProvider>
        <p>inside</p>
      </StoreProvider>,
    );
    expect(screen.getByText("inside")).toBeInTheDocument();
  });

  it("login page renders form", () => {
    render(<LoginPage />);
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("admin layout renders nav and content", () => {
    render(
      <AdminLayout>
        <p>section</p>
      </AdminLayout>,
    );
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("Wallet")).toBeInTheDocument();
    expect(screen.getByText("Entitlements")).toBeInTheDocument();
    expect(screen.getByText("Grace")).toBeInTheDocument();
    expect(screen.getByText("Payments")).toBeInTheDocument();
    expect(screen.getByText("section")).toBeInTheDocument();
  });

  it("dashboard renders heading", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});
