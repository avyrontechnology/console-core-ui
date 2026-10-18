import { render, screen } from "@testing-library/react";

import UsersPage from "@/app/(admin)/users/page";
import { useUsers } from "@/features/users/hooks";

jest.mock("@/features/users/hooks", () => ({
  useUsers: jest.fn(),
  useDeleteUser: jest.fn(() => ({ remove: jest.fn(), isSaving: false, error: null })),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
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

const mockedUseUsers = useUsers as jest.Mock;

describe("UsersPage", () => {
  it("renders list state", () => {
    mockedUseUsers.mockReturnValue({
      users: [
        {
          id: "1",
          name: "Alice",
          email: "a@x.com",
          phone_number: "+911",
          partner_id: null,
          role_id: null,
          is_active: true,
        },
      ],
      totalCount: 1,
      isLoading: false,
      error: null,
    });
    render(<UsersPage />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("renders loading and error states", () => {
    mockedUseUsers.mockReturnValue({
      users: [],
      totalCount: 0,
      isLoading: true,
      error: null,
    });
    const { unmount } = render(<UsersPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    unmount();
    mockedUseUsers.mockReturnValue({
      users: [],
      totalCount: 0,
      isLoading: false,
      error: "down",
    });
    render(<UsersPage />);
    expect(screen.getByText("down")).toBeInTheDocument();
  });
});
