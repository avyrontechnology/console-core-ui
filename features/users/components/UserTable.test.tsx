import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { UserTable } from "@/features/users/components/UserTable";
import type { User } from "@/types/user";

const users: User[] = [
  {
    id: "1",
    name: "Alice",
    email: "a@x.com",
    phone_number: "+911",
    partner_id: null,
    role_id: null,
    is_active: true,
  },
  {
    id: "2",
    name: "Bob",
    email: "b@x.com",
    phone_number: "+912",
    partner_id: null,
    role_id: null,
    is_active: false,
  },
];

describe("UserTable", () => {
  it("renders rows with status text", () => {
    render(<UserTable users={users} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(<UserTable users={[]} />);
    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });

  it("calls onSelect from row action", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    render(<UserTable users={users} onSelect={onSelect} />);
    await user.click(screen.getAllByRole("button", { name: /view/i })[0]);
    expect(onSelect).toHaveBeenCalledWith(users[0]);
  });
});
