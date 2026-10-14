import { rbacApi } from "@/features/rbac/api";
import { consoleApi } from "@/lib/console";

jest.mock("@/lib/console", () => ({
  consoleApi: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mocked = consoleApi as unknown as {
  get: jest.Mock;
  post: jest.Mock;
  patch: jest.Mock;
  put: jest.Mock;
  delete: jest.Mock;
};

describe("rbacApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lists roles, permissions and matrix", async () => {
    mocked.get.mockResolvedValue([]);
    await rbacApi.roles();
    await rbacApi.permissions();
    await rbacApi.matrix();
    expect(mocked.get).toHaveBeenCalledWith(expect.stringContaining("/role"));
    expect(mocked.get).toHaveBeenCalledWith(expect.stringContaining("/permission"));
    expect(mocked.get).toHaveBeenCalledWith(
      expect.stringContaining("/get_permissions_for_all_roles"),
    );
  });

  it("CRUDs roles by id", async () => {
    const id = "11111111-1111-1111-1111-111111111111";
    mocked.get.mockResolvedValue({});
    mocked.post.mockResolvedValue({});
    mocked.patch.mockResolvedValue({});
    mocked.delete.mockResolvedValue(undefined);
    await rbacApi.roleById(id);
    await rbacApi.createRole({
      name: "R",
      slug: "r",
      hierarchy: 4,
      description: "d",
    });
    await rbacApi.updateRole(id, { name: "R2" });
    await rbacApi.deleteRole(id);
    expect(mocked.get).toHaveBeenCalledWith(expect.stringContaining(id));
    expect(mocked.patch).toHaveBeenCalledWith(expect.stringContaining(id), { name: "R2" });
    expect(mocked.delete).toHaveBeenCalledWith(expect.stringContaining(id));
  });

  it("saves action permissions with partner scope", async () => {
    mocked.put.mockResolvedValue({});
    await rbacApi.setRoleActionPermissions("r1", "p1", { "a:b": true });
    expect(mocked.put).toHaveBeenCalledWith(expect.stringContaining("action-permissions"), {
      partner_id: "p1",
      permissions: { "a:b": true },
    });
  });
});
