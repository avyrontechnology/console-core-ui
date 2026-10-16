import { renderHook, waitFor } from "@testing-library/react";

import { graceApi } from "@/features/grace/api";
import { useGraceStatus, useGrantGrace } from "@/features/grace/hooks";

jest.mock("@/features/grace/api", () => ({
  graceApi: {
    status: jest.fn(),
    grant: jest.fn(),
  },
}));

const mocked = graceApi as unknown as Record<string, jest.Mock>;

describe("grace hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads status", async () => {
    mocked.status.mockResolvedValue({ partner_id: "p1" });
    const { result } = renderHook(() => useGraceStatus("p1"));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual({ partner_id: "p1" });
  });

  it("skips null partner", () => {
    const { result } = renderHook(() => useGraceStatus(null));
    expect(result.current.data).toBeNull();
    expect(mocked.status).not.toHaveBeenCalled();
  });

  it("grants grace", async () => {
    mocked.grant.mockResolvedValue({ grace_id: "g1" });
    const { result } = renderHook(() => useGrantGrace());
    const { act } = await import("@testing-library/react");
    let out: unknown;
    await act(async () => {
      out = await result.current.grant({ partner_id: "p1", granted_days: 3, remark: "r" });
    });
    expect(out).toEqual({ grace_id: "g1" });
  });
});
