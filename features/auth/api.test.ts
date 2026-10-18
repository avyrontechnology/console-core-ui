import { fetchUserPermissions } from "@/features/auth/api";
import { ENDPOINTS } from "@/lib/endpoints";

describe("fetchUserPermissions", () => {
  const ok = (body: unknown) =>
    Promise.resolve({ ok: true, json: () => Promise.resolve(body) } as Response);

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns slug list from the backend", async () => {
    (global.fetch as jest.Mock).mockReturnValue(
      ok({ data: ["console:get_all_users", "console:get_audit_logs"] }),
    );
    const result = await fetchUserPermissions("token-123");
    expect(result).toEqual(["console:get_all_users", "console:get_audit_logs"]);
    expect(global.fetch).toHaveBeenCalledWith(ENDPOINTS.USER_PERMISSIONS(), {
      headers: { Authorization: "Bearer token-123" },
      cache: "no-store",
    });
  });

  it("throws on a non-ok response", async () => {
    (global.fetch as jest.Mock).mockReturnValue(
      Promise.resolve({ ok: false, status: 401 } as Response),
    );
    await expect(fetchUserPermissions("t")).rejects.toThrow(/401/);
  });

  it("returns an empty list when the payload shape is unexpected", async () => {
    (global.fetch as jest.Mock).mockReturnValue(ok({ data: { can_view_users: true } }));
    await expect(fetchUserPermissions("t")).resolves.toEqual([]);
  });

  it("drops non-string entries", async () => {
    (global.fetch as jest.Mock).mockReturnValue(ok({ data: ["console:x", 5, null] }));
    await expect(fetchUserPermissions("t")).resolves.toEqual(["console:x"]);
  });
});
