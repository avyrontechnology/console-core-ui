import { usersApi } from "@/features/users/api";
import { consoleApi } from "@/lib/console";

jest.mock("@/lib/console", () => ({
  consoleApi: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mocked = consoleApi as unknown as {
  get: jest.Mock;
  post: jest.Mock;
  patch: jest.Mock;
  delete: jest.Mock;
};

describe("usersApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lists with pagination params", async () => {
    mocked.get.mockResolvedValue([]);
    await usersApi.list({ offset: 20, limit: 20 });
    expect(mocked.get).toHaveBeenCalledWith(expect.stringContaining("/users?offset=20&limit=20"));
  });

  it("builds detail/update/delete URLs from id", async () => {
    const id = "11111111-1111-1111-1111-111111111111";
    mocked.get.mockResolvedValue({});
    mocked.patch.mockResolvedValue({});
    mocked.delete.mockResolvedValue(undefined);
    await usersApi.getById(id);
    await usersApi.update(id, { name: "X" });
    await usersApi.remove(id);
    expect(mocked.get).toHaveBeenCalledWith(expect.stringContaining(id));
    expect(mocked.patch).toHaveBeenCalledWith(expect.stringContaining(id), { name: "X" });
    expect(mocked.delete).toHaveBeenCalledWith(expect.stringContaining(id));
  });

  it("creates via signup endpoint", async () => {
    mocked.post.mockResolvedValue({});
    await usersApi.create({
      name: "A",
      email: "a@x.com",
      phone_number: "+911234567890",
      password: "secret123",
      partner_id: "11111111-1111-1111-1111-111111111111",
      role_id: "22222222-2222-2222-2222-222222222222",
    });
    expect(mocked.post).toHaveBeenCalledWith(
      expect.stringContaining("/do_signup"),
      expect.objectContaining({ email: "a@x.com" }),
    );
  });
});
