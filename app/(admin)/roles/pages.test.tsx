import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import NewRolePage from "@/app/(admin)/roles/new/page";
import RoleDetailPage from "@/app/(admin)/roles/[id]/page";
import RolesPage from "@/app/(admin)/roles/page";
import MatrixPage from "@/app/(admin)/roles/matrix/page";
import {
  useCreateRole,
  useDeleteRole,
  usePermissionMatrix,
  useRole,
  useRoles,
  useSetRoleActionPermissions,
} from "@/features/rbac/hooks";

jest.mock("@/features/rbac/hooks", () => ({
  useCreateRole: jest.fn(),
  useDeleteRole: jest.fn(),
  usePermissionMatrix: jest.fn(),
  useRole: jest.fn(),
  useRoles: jest.fn(),
  useSetRoleActionPermissions: jest.fn(),
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

jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      partnerInfo: {
        partner_id: "11111111-1111-1111-1111-111111111111",
      },
    },
    status: "authenticated",
  }),
}));

const role = {
  id: "1",
  name: "Admin",
  slug: "admin",
  hierarchy: 1,
  is_active: true,
};

describe("role pages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("list renders rows", () => {
    (useRoles as jest.Mock).mockReturnValue({
      data: [role],
      isLoading: false,
      error: null,
      refresh: jest.fn(),
    });
    render(<RolesPage />);
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("new submits form", async () => {
    const u = userEvent.setup();
    const create = jest.fn().mockResolvedValue({ id: "9" });
    (useCreateRole as jest.Mock).mockReturnValue({
      create,
      isSaving: false,
      error: null,
    });
    render(<NewRolePage />);
    await u.type(screen.getByLabelText(/^name/i), "Manager");
    await u.type(screen.getByLabelText(/slug/i), "manager");
    await u.type(screen.getByLabelText(/hierarchy/i), "4");
    await u.type(screen.getByLabelText(/description/i), "Manages");
    await u.click(screen.getByRole("button", { name: /create role/i }));
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ slug: "manager", hierarchy: 4 }));
  });

  it("detail toggles and saves permissions", async () => {
    const u = userEvent.setup();
    const save = jest.fn().mockResolvedValue(undefined);
    (useRole as jest.Mock).mockReturnValue({
      data: role,
      isLoading: false,
      error: null,
    });
    (usePermissionMatrix as jest.Mock).mockReturnValue({
      data: {
        default_role_permission: {
          Admin: {
            User: {
              "console:get_all_users": { id: "p1", is_default: true },
            },
          },
        },
      },
      isLoading: false,
      error: null,
    });
    (useDeleteRole as jest.Mock).mockReturnValue({
      remove: jest.fn(),
      isSaving: false,
      error: null,
    });
    (useSetRoleActionPermissions as jest.Mock).mockReturnValue({
      save,
      isSaving: false,
      error: null,
    });
    render(<RoleDetailPage />);
    const boxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
    expect(boxes[0].checked).toBe(true);
    await u.click(boxes[0]);
    await u.click(screen.getByRole("button", { name: /save permissions/i }));
    expect(save).toHaveBeenCalledWith("1", "11111111-1111-1111-1111-111111111111", {
      "console:get_all_users": false,
    });
  });

  it("matrix page renders all roles", () => {
    (usePermissionMatrix as jest.Mock).mockReturnValue({
      data: {
        default_role_permission: {
          Admin: {
            User: {
              "console:get_all_users": { id: "p1", is_default: true },
            },
          },
        },
      },
      isLoading: false,
      error: null,
      refresh: jest.fn(),
    });
    render(<MatrixPage />);
    expect(screen.getByText("Permission matrix")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });
});
