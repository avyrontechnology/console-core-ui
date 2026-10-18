import { render, screen } from "@testing-library/react";

import ProtectedRoute from "@/components/ProtectedRoute";

jest.mock("@/hooks/usePermissions", () => ({
  usePermissions: jest.fn(),
}));

import { usePermissions } from "@/hooks/usePermissions";

const mocked = usePermissions as jest.Mock;

describe("ProtectedRoute", () => {
  it("renders children when permission present", () => {
    mocked.mockReturnValue({
      isLoading: false,
      hasPermission: () => true,
    });
    render(
      <ProtectedRoute requiredPermission="console:get_all_users">
        <p>secret</p>
      </ProtectedRoute>,
    );
    expect(screen.getByText("secret")).toBeInTheDocument();
  });

  it("shows a loading skeleton while permissions resolve", () => {
    mocked.mockReturnValue({ isLoading: true, hasPermission: jest.fn() });
    render(
      <ProtectedRoute requiredPermission="console:get_all_users">
        <div>secret</div>
      </ProtectedRoute>,
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByText("secret")).not.toBeInTheDocument();
  });

  it("denies without the permission", () => {
    mocked.mockReturnValue({
      isLoading: false,
      hasPermission: () => false,
    });
    render(
      <ProtectedRoute requiredPermission="console:get_all_users">
        <p>secret</p>
      </ProtectedRoute>,
    );
    expect(screen.queryByText("secret")).not.toBeInTheDocument();
    expect(screen.getByText(/insufficient permissions/i)).toBeInTheDocument();
  });
});
