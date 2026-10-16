import { renderHook, waitFor } from "@testing-library/react";

import { entitlementsApi } from "@/features/entitlements/api";
import { useUpdateStartDate } from "@/features/entitlements/hooks";

jest.mock("@/features/entitlements/api", () => ({
  entitlementsApi: {
    updateStartDate: jest.fn(),
    dismissPopup: jest.fn(),
  },
}));

const mocked = entitlementsApi as unknown as Record<string, jest.Mock>;

describe("entitlements hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updates start date", async () => {
    mocked.updateStartDate.mockResolvedValue([{ id: "e1" }]);
    const { result } = renderHook(() => useUpdateStartDate());
    const { act } = await import("@testing-library/react");
    let out: unknown;
    await act(async () => {
      out = await result.current.update({ order_id: "o1", start_date: 1700000000000 });
    });
    expect(out).toEqual([{ id: "e1" }]);
    await waitFor(() => expect(result.current.isSaving).toBe(false));
  });
});
