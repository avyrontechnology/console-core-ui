import { act, renderHook, waitFor } from "@testing-library/react";

import { usersApi } from "@/features/users/api";
import { useCreateUser, useDeleteUser, useUser, useUsers } from "@/features/users/hooks";

jest.mock("@/features/users/api", () => ({
  usersApi: {
    list: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    roles: jest.fn(),
  },
}));

const mocked = usersApi as unknown as Record<string, jest.Mock>;

describe("users hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("useUsers loads list", async () => {
    mocked.list.mockResolvedValue([{ id: "1" }]);
    const { result } = renderHook(() => useUsers({ offset: 0, limit: 20 }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual([{ id: "1" }]);
    expect(mocked.list).toHaveBeenCalledWith({ offset: 0, limit: 20 });
  });

  it("useUsers surfaces errors", async () => {
    mocked.list.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe("boom");
    expect(result.current.users).toEqual([]);
  });

  it("useUser skips null id", () => {
    const { result } = renderHook(() => useUser(null));
    expect(result.current.data).toBeNull();
    expect(mocked.getById).not.toHaveBeenCalled();
  });

  it("useCreateUser creates and resets state", async () => {
    mocked.create.mockResolvedValue({ id: "9" });
    const { result } = renderHook(() => useCreateUser());
    let out: unknown;
    await act(async () => {
      out = await result.current.create({
        name: "A",
        email: "a@x.com",
        phone_number: "+911",
        password: "secret123",
        partner_id: "11111111-1111-1111-1111-111111111111",
        role_id: "22222222-2222-2222-2222-222222222222",
      });
    });
    expect(out).toEqual({ id: "9" });
    expect(result.current.isSaving).toBe(false);
  });

  it("useDeleteUser removes", async () => {
    mocked.remove.mockResolvedValue(undefined);
    const { result } = renderHook(() => useDeleteUser());
    await act(async () => {
      await result.current.remove("9");
    });
    expect(mocked.remove).toHaveBeenCalledWith("9");
    expect(result.current.error).toBeNull();
  });

  it("useUser loads and handles errors", async () => {
    const { renderHook, waitFor } = await import("@testing-library/react");
    const { useRoles, useUser } = await import("@/features/users/hooks");
    mocked.roles.mockResolvedValue([]);
    const { result } = renderHook(() => useRoles());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual([]);

    mocked.getById.mockResolvedValue({ id: "1" });
    const single = renderHook(() => useUser("1"));
    await waitFor(() => expect(single.result.current.isLoading).toBe(false));
    expect(single.result.current.data).toEqual({ id: "1" });

    mocked.getById.mockRejectedValue(new Error("gone"));
    const failed = renderHook(() => useUser("2"));
    await waitFor(() => expect(failed.result.current.isLoading).toBe(false));
    expect(failed.result.current.error).toBe("gone");
  });

  it("useUpdateUser updates", async () => {
    const { renderHook, waitFor, act } = await import("@testing-library/react");
    const { useUpdateUser } = await import("@/features/users/hooks");
    mocked.update.mockResolvedValue({ id: "1", name: "B" });
    const { result } = renderHook(() => useUpdateUser());
    let out: unknown;
    await act(async () => {
      out = await result.current.update("1", { name: "B" });
    });
    expect(out).toEqual({ id: "1", name: "B" });
    await waitFor(() => expect(result.current.isSaving).toBe(false));
  });

  it("mutation errors surface and rethrow", async () => {
    const { renderHook, act } = await import("@testing-library/react");
    const { useCreateUser, useDeleteUser } = await import("@/features/users/hooks");
    mocked.create.mockRejectedValue(new Error("taken"));
    const creator = renderHook(() => useCreateUser());
    await act(async () => {
      await expect(
        creator.result.current.create({
          name: "A",
          email: "a@x.com",
          phone_number: "+911",
          password: "secret123",
          partner_id: "11111111-1111-1111-1111-111111111111",
          role_id: "22222222-2222-2222-2222-222222222222",
        }),
      ).rejects.toThrow("taken");
    });
    expect(creator.result.current.error).toBe("taken");

    mocked.remove.mockRejectedValue(new Error("gone"));
    const remover = renderHook(() => useDeleteUser());
    await act(async () => {
      await expect(remover.result.current.remove("9")).rejects.toThrow("gone");
    });
    expect(remover.result.current.error).toBe("gone");
  });
});
