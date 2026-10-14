import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import NewUserPage from "@/app/(admin)/users/new/page";
import UserDetailPage from "@/app/(admin)/users/[id]/page";
import {
  useCreateUser,
  useDeleteUser,
  useRoles,
  useUpdateUser,
  useUser,
} from "@/features/users/hooks";

jest.mock("@/features/users/hooks", () => ({
  useCreateUser: jest.fn(),
  useDeleteUser: jest.fn(),
  useUpdateUser: jest.fn(),
  useRoles: jest.fn(),
  useUser: jest.fn(),
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

describe("user pages", () => {
  it("new page renders form", () => {
    (useRoles as jest.Mock).mockReturnValue({ data: [] });
    (useCreateUser as jest.Mock).mockReturnValue({
      create: jest.fn(),
      isSaving: false,
      error: null,
    });
    render(<NewUserPage />);
    expect(screen.getByRole("button", { name: /create user/i })).toBeInTheDocument();
  });

  it("detail page renders user and actions", () => {
    (useUser as jest.Mock).mockReturnValue({
      data: {
        id: "1",
        name: "Alice",
        email: "a@x.com",
        phone_number: "+911",
        partner_id: null,
        role_id: null,
        is_active: true,
      },
      isLoading: false,
      error: null,
    });
    (useUpdateUser as jest.Mock).mockReturnValue({
      update: jest.fn(),
      isSaving: false,
      error: null,
    });
    (useDeleteUser as jest.Mock).mockReturnValue({
      remove: jest.fn(),
      isSaving: false,
      error: null,
    });
    render(<UserDetailPage />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^save$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^delete$/i })).toBeInTheDocument();
  });
});

describe("user detail flows", () => {
  const user = {
    id: "1",
    name: "Alice",
    email: "a@x.com",
    phone_number: "+911",
    partner_id: null,
    role_id: null,
    is_active: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useUser as jest.Mock).mockReturnValue({
      data: user,
      isLoading: false,
      error: null,
    });
  });

  it("saves name edits", async () => {
    const u = userEvent.setup();
    const update = jest.fn().mockResolvedValue({ ...user, name: "A2" });
    (useUpdateUser as jest.Mock).mockReturnValue({
      update,
      isSaving: false,
      error: null,
    });
    (useDeleteUser as jest.Mock).mockReturnValue({
      remove: jest.fn(),
      isSaving: false,
      error: null,
    });
    render(<UserDetailPage />);
    await u.clear(screen.getByLabelText(/name/i));
    await u.type(screen.getByLabelText(/name/i), "A2");
    await u.click(screen.getByRole("button", { name: /^save$/i }));
    expect(update).toHaveBeenCalledWith("1", expect.objectContaining({ name: "A2" }));
  });

  it("deletes after confirm", async () => {
    const u = userEvent.setup();
    const remove = jest.fn().mockResolvedValue(undefined);
    (useUpdateUser as jest.Mock).mockReturnValue({
      update: jest.fn(),
      isSaving: false,
      error: null,
    });
    (useDeleteUser as jest.Mock).mockReturnValue({
      remove,
      isSaving: false,
      error: null,
    });
    render(<UserDetailPage />);
    await u.click(screen.getAllByRole("button", { name: /^delete$/i })[0]);
    await u.click(screen.getAllByRole("button", { name: /^delete$/i })[1]);
    expect(remove).toHaveBeenCalledWith("1");
  });
});

describe("new user flow", () => {
  it("submits valid form to create", async () => {
    const u = userEvent.setup();
    const create = jest.fn().mockResolvedValue({ id: "9" });
    (useCreateUser as jest.Mock).mockReturnValue({
      create,
      isSaving: false,
      error: null,
    });
    (useRoles as jest.Mock).mockReturnValue({
      data: [
        {
          id: "22222222-2222-2222-2222-222222222222",
          name: "Admin",
          slug: "admin",
          is_active: true,
        },
      ],
    });
    render(<NewUserPage />);
    await u.type(screen.getByLabelText(/name/i), "Alice");
    await u.type(screen.getByLabelText(/email/i), "a@x.com");
    await u.type(screen.getByLabelText(/phone number/i), "+911234567890");
    await u.type(screen.getByLabelText(/^password/i), "secret123");
    await u.selectOptions(screen.getByLabelText(/role/i), "22222222-2222-2222-2222-222222222222");
    await u.type(screen.getByLabelText(/partner id/i), "11111111-1111-1111-1111-111111111111");
    await u.click(screen.getByRole("button", { name: /create user/i }));
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ email: "a@x.com" }));
  });
});
