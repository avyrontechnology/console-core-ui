import { renderHook, waitFor } from "@testing-library/react";

import { partnerMetaApi } from "@/features/partner-meta/api";
import { usePartnerMeta, useSavePartnerMeta } from "@/features/partner-meta/hooks";

jest.mock("@/features/partner-meta/api", () => ({
  partnerMetaApi: {
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}));

const mocked = partnerMetaApi as unknown as Record<string, jest.Mock>;

describe("partner-meta hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads meta", async () => {
    mocked.get.mockResolvedValue({ id: "m1" });
    const { result } = renderHook(() => usePartnerMeta("p1"));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual({ id: "m1" });
  });

  it("skips null id", () => {
    const { result } = renderHook(() => usePartnerMeta(null));
    expect(result.current.data).toBeNull();
    expect(mocked.get).not.toHaveBeenCalled();
  });

  it("saves via update when exists", async () => {
    mocked.update.mockResolvedValue({ id: "m1" });
    const { result } = renderHook(() => useSavePartnerMeta());
    const { act } = await import("@testing-library/react");
    let out: unknown;
    await act(async () => {
      out = await result.current.save("p1", { years_in_business: 2 }, true);
    });
    expect(out).toEqual({ id: "m1" });
    expect(mocked.update).toHaveBeenCalled();
  });
});
