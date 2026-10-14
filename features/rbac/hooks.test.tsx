import { act, renderHook, waitFor } from "@testing-library/react";

import { rbacApi } from "@/features/rbac/api";
import {
  useCreateRole,
  useDeleteRole,
  usePermissionMatrix,
  useRole,
  useRoles,
  useSetRoleActionPermissions,
  useUpdateRole,
} from "@/features/rbac/hooks";

jest.mock("@/features/rbac/api", () => ({
  rbacApi: {
    roles: jest.fn(),
    roleById: jest.fn(),
    createRole: jest.fn(),
    updateRole: jest.fn(),
    deleteRole: jest.fn(),
    permissions: jest.fn(),
    matrix: jest.fn(),
    setRoleActionPermissions: jest.fn(),
  },
}));

const mocked = rbacApi as unknown as Record<string, jest.Mock>;

describe("rbac hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("useRoles loads list", async () => {
    mocked.roles.mockResolvedValue([{ id: "1" }]);
    const { result } = renderHook(() => useRoles());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual([{ id: "1" }]);
  });

  it("useRole skips null id", () => {
    const { result } = renderHook(() => useRole(null));
    expect(result.current.data).toBeNull();
    expect(mocked.roleById).not.toHaveBeenCalled();
  });

  it("mutations round-trip", async () => {
    mocked.createRole.mockResolvedValue({ id: "9" });
    mocked.updateRole.mockResolvedValue({ id: "9" });
    mocked.deleteRole.mockResolvedValue(undefined);
    mocked.setRoleActionPermissions.mockResolvedValue({});

    const creator = renderHook(() => useCreateRole());
    let created: unknown;
    await act(async () => {
      created = await creator.result.current.create({
        name: "R",
        slug: "r",
        hierarchy: 4,
        description: "d",
      });
    });
    expect(created).toEqual({ id: "9" });

    const updater = renderHook(() => useUpdateRole());
    await act(async () => {
      await updater.result.current.update("9", { name: "R2" });
    });
    expect(mocked.updateRole).toHaveBeenCalledWith("9", { name: "R2" });

    const remover = renderHook(() => useDeleteRole());
    await act(async () => {
      await remover.result.current.remove("9");
    });
    expect(mocked.deleteRole).toHaveBeenCalledWith("9");

    const saver = renderHook(() => useSetRoleActionPermissions());
    await act(async () => {
      await saver.result.current.save("9", "p1", { "a:b": true });
    });
    expect(mocked.setRoleActionPermissions).toHaveBeenCalledWith("9", "p1", {
      "a:b": true,
    });
  });

  it("usePermissionMatrix refreshes", async () => {
    mocked.matrix.mockResolvedValue({ default_role_permission: {} });
    const { result } = renderHook(() => usePermissionMatrix());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual({ default_role_permission: {} });
    mocked.matrix.mockResolvedValue({ default_role_permission: { A: {} } });
    await act(async () => {
      await result.current.refresh();
    });
    expect(result.current.data).toEqual({ default_role_permission: { A: {} } });
  });
});
