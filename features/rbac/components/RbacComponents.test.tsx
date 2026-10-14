import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PermissionMatrix } from "@/features/rbac/components/PermissionMatrix";
import { RoleForm } from "@/features/rbac/components/RoleForm";
import { RoleTable } from "@/features/rbac/components/RoleTable";
import type { PermissionMatrix as Matrix } from "@/types/rbac";
import type { Role } from "@/types/rbac";

const roles: Role[] = [
  {
    id: "1",
    name: "Admin",
    slug: "admin",
    hierarchy: 1,
    is_active: true,
  },
];

const matrix: Matrix = {
  Admin: {
    User: {
      "console:get_all_users": {
        id: "p1",
        display_text: "Get All Users (User)",
        is_default: true,
      },
      "console:delete_user": {
        id: "p2",
        display_text: "Delete User (User)",
        is_default: false,
      },
    },
  },
};

describe("RoleTable", () => {
  it("renders rows and empty state", () => {
    const { unmount } = render(<RoleTable roles={roles} />);
    expect(screen.getByText("Admin")).toBeInTheDocument();
    unmount();
    render(<RoleTable roles={[]} />);
    expect(screen.getByText(/no roles found/i)).toBeInTheDocument();
  });
});

describe("RoleForm", () => {
  it("submits valid values", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<RoleForm onSubmit={onSubmit} isSaving={false} serverError={null} />);
    await user.type(screen.getByLabelText(/^name/i), "Manager");
    await user.type(screen.getByLabelText(/slug/i), "manager");
    await user.type(screen.getByLabelText(/hierarchy/i), "4");
    await user.type(screen.getByLabelText(/description/i), "Manages things");
    await user.click(screen.getByRole("button", { name: /create role/i }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ slug: "manager", hierarchy: 4 }),
    );
  });
});

describe("PermissionMatrix", () => {
  it("renders roles, categories and defaults", () => {
    render(<PermissionMatrix matrix={matrix} grants={{}} onToggle={jest.fn()} />);
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
    const boxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
    expect(boxes).toHaveLength(2);
    expect(boxes[0].checked).toBe(true);
    expect(boxes[1].checked).toBe(false);
  });

  it("prefers explicit grants over defaults and reports toggles", async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();
    render(
      <PermissionMatrix
        matrix={matrix}
        grants={{ "console:delete_user": true }}
        onToggle={onToggle}
      />,
    );
    const boxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
    expect(boxes[1].checked).toBe(true);
    await user.click(boxes[0]);
    expect(onToggle).toHaveBeenCalledWith("console:get_all_users", false);
  });

  it("shows empty state", () => {
    render(<PermissionMatrix matrix={{}} grants={{}} onToggle={jest.fn()} />);
    expect(screen.getByText(/no permissions found/i)).toBeInTheDocument();
  });
});
