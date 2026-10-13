import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";

import LoginForm from "@/components/LoginForm";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockedSignIn = signIn as jest.Mock;

describe("LoginForm", () => {
  beforeEach(() => {
    mockedSignIn.mockReset();
  });

  it("validates empty submit", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findAllByText(/required/i)).not.toHaveLength(0);
    expect(mockedSignIn).not.toHaveBeenCalled();
  });

  it("submits credentials", async () => {
    const user = userEvent.setup();
    mockedSignIn.mockResolvedValue({ ok: true });
    render(<LoginForm />);
    await user.type(screen.getByLabelText(/email/i), "a@x.com");
    await user.type(screen.getByLabelText(/password/i), "secret123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(mockedSignIn).toHaveBeenCalledWith(
      "credentials",
      expect.objectContaining({ email: "a@x.com", password: "secret123" }),
    );
  });
});
