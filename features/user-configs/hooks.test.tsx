import { act, renderHook, waitFor } from "@testing-library/react";

import { userConfigsApi } from "@/features/user-configs/api";
import { toFlags, useUserConfigs } from "@/features/user-configs/hooks";

jest.mock("@/features/user-configs/api", () => ({
  userConfigsApi: {
    list: jest.fn(),
    upsert: jest.fn(),
  },
}));

const mocked = userConfigsApi as unknown as Record<string, jest.Mock>;

describe("toFlags", () => {
  it("maps known boolean keys", () => {
    expect(
      toFlags([
        { key: "is_talko_enabled", value: true },
        { key: "enable_dialer", value: 0 },
        { key: "unknown_key", value: "x" },
        { value: true },
      ]),
    ).toEqual({ is_talko_enabled: true, enable_dialer: false });
  });
});

describe("user-configs hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads configs and derived flags", async () => {
    mocked.list.mockResolvedValue([{ key: "is_talko_enabled", value: true }]);
    const { result } = renderHook(() => useUserConfigs("u1"));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.flags).toEqual({ is_talko_enabled: true });
    expect(mocked.list).toHaveBeenCalledWith("u1");
  });

  it("surfaces load errors", async () => {
    mocked.list.mockRejectedValue(new Error("nope"));
    const { result } = renderHook(() => useUserConfigs());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe("nope");
  });

  it("saves flags", async () => {
    mocked.list.mockResolvedValue([]);
    mocked.upsert.mockResolvedValue([{ key: "is_talko_enabled", updated_at: 1 }]);
    const { result } = renderHook(() => useUserConfigs());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    let saved: unknown;
    await act(async () => {
      saved = await result.current.save("p1", ["u1"], { is_talko_enabled: true });
    });
    expect(mocked.upsert).toHaveBeenCalledWith("p1", ["u1"], { is_talko_enabled: true });
    expect(saved).toEqual([{ key: "is_talko_enabled", updated_at: 1 }]);
  });

  it("surfaces save errors", async () => {
    mocked.list.mockResolvedValue([]);
    mocked.upsert.mockRejectedValue(new Error("denied"));
    const { result } = renderHook(() => useUserConfigs());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await expect(result.current.save("p1", ["u1"], {})).rejects.toThrow("denied");
    });
    expect(result.current.error).toBe("denied");
  });
});
