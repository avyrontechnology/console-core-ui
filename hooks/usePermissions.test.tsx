import { act, renderHook, waitFor } from "@testing-library/react";

import { useSession } from "next-auth/react";

import { fetchUserPermissions, SessionExpiredError } from "@/features/auth/api";
import { usePermissions } from "@/hooks/usePermissions";

jest.mock("next-auth/react", () => ({ useSession: jest.fn() }));
jest.mock("@/features/auth/api", () => ({
  fetchUserPermissions: jest.fn(),
  SessionExpiredError: class SessionExpiredError extends Error {},
}));

const session = useSession as unknown as jest.Mock;
const mockedFetch = fetchUserPermissions as unknown as jest.Mock;

describe("usePermissions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    session.mockReturnValue({
      status: "authenticated",
      data: { accessToken: "tok", permissions: { can_view_users: true } },
    });
  });

  it("normalises a feature-flag map while loading", () => {
    mockedFetch.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => usePermissions());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.permissions).toEqual(["can_view_users"]);
  });

  it("prefers real slugs once fetched", async () => {
    mockedFetch.mockResolvedValue(["console:get_all_users"]);
    const { result } = renderHook(() => usePermissions());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasPermission("console:get_all_users")).toBe(true);
    expect(result.current.hasPermission("console:get_audit_logs")).toBe(false);
    expect(result.current.hasAnyPermission(["console:x", "console:get_all_users"])).toBe(true);
  });

  it("falls back to session flags when the fetch fails", async () => {
    mockedFetch.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => usePermissions());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasPermission("can_view_users")).toBe(true);
  });

  it("does not fall back to flags when the session expired", async () => {
    mockedFetch.mockRejectedValue(new SessionExpiredError());
    const { result } = renderHook(() => usePermissions());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.permissions).toEqual([]);
  });

  it("never crashes on a non-array, non-object payload", async () => {
    session.mockReturnValue({
      status: "authenticated",
      data: { accessToken: "t", permissions: 7 },
    });
    mockedFetch.mockResolvedValue([]);
    const { result } = renderHook(() => usePermissions());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.permissions).toEqual([]);
  });

  it("does not fetch while unauthenticated", () => {
    session.mockReturnValue({ status: "unauthenticated", data: null });
    const { result } = renderHook(() => usePermissions());
    expect(result.current.isAuthenticated).toBe(false);
    expect(mockedFetch).not.toHaveBeenCalled();
    act(() => undefined);
  });
});
