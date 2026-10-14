import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { UserForm } from "@/features/users/components/UserForm";

describe("UserForm", () => {
  const roles = [
    {
      id: "22222222-2222-2222-2222-222222222222",
      name: "Admin",
      slug: "admin",
      is_active: true,
    },
  ];

  it("requires fields before submit", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<UserForm roles={roles} onSubmit={onSubmit} isSaving={false} serverError={null} />);
    await user.click(screen.getByRole("button", { name: /create user/i }));
    expect(await screen.findAllByText(/required|valid/i)).not.toHaveLength(0);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits valid values", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<UserForm roles={roles} onSubmit={onSubmit} isSaving={false} serverError={null} />);
    await user.type(screen.getByLabelText(/name/i), "Alice");
    await user.type(screen.getByLabelText(/email/i), "a@x.com");
    await user.type(screen.getByLabelText(/phone number/i), "+911234567890");
    await user.type(screen.getByLabelText(/^password/i), "secret123");
    await user.selectOptions(
      screen.getByLabelText(/role/i),
      "22222222-2222-2222-2222-222222222222",
    );
    await user.type(screen.getByLabelText(/partner id/i), "11111111-1111-1111-1111-111111111111");
    await user.click(screen.getByRole("button", { name: /create user/i }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "a@x.com",
        role_id: "22222222-2222-2222-2222-222222222222",
      }),
    );
  });

  it("shows server error", () => {
    render(
      <UserForm roles={roles} onSubmit={jest.fn()} isSaving={false} serverError="Email taken" />,
    );
    expect(screen.getByText("Email taken")).toBeInTheDocument();
  });
});
