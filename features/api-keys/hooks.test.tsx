import { act, renderHook, waitFor } from "@testing-library/react";

import { apiKeysApi } from "@/features/api-keys/api";
import { useApiKey, useInactivateKey, useRotateKey, useUpdateKey } from "@/features/api-keys/hooks";

jest.mock("@/features/api-keys/api", () => ({
  apiKeysApi: {
    current: jest.fn(),
    rotate: jest.fn(),
    update: jest.fn(),
    inactivate: jest.fn(),
  },
}));

const mocked = apiKeysApi as unknown as Record<string, jest.Mock>;

describe("api-keys hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("useApiKey loads and refreshes", async () => {
    mocked.current.mockResolvedValue({ id: "1" });
    const { result } = renderHook(() => useApiKey());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual({ id: "1" });
    mocked.current.mockResolvedValue({ id: "2" });
    await act(async () => {
      await result.current.refresh();
    });
    expect(result.current.data).toEqual({ id: "2" });
  });

  it("mutations round-trip", async () => {
    mocked.rotate.mockResolvedValue({ id: "2" });
    mocked.update.mockResolvedValue({ id: "2" });
    mocked.inactivate.mockResolvedValue({ id: "2" });

    const rotator = renderHook(() => useRotateKey());
    let rotated: unknown;
    await act(async () => {
      rotated = await rotator.result.current.rotate({ scopes: [] });
    });
    expect(rotated).toEqual({ id: "2" });

    const updater = renderHook(() => useUpdateKey());
    await act(async () => {
      await updater.result.current.update({ scopes: [] });
    });
    expect(mocked.update).toHaveBeenCalledWith({ scopes: [] });

    const killer = renderHook(() => useInactivateKey());
    await act(async () => {
      await killer.result.current.inactivate();
    });
    expect(mocked.inactivate).toHaveBeenCalled();
  });

  it("surfaces errors", async () => {
    mocked.current.mockRejectedValue(new Error("down"));
    const { result } = renderHook(() => useApiKey());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe("down");
  });
});
