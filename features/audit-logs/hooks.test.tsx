import { act, renderHook, waitFor } from "@testing-library/react";

import { auditLogsApi } from "@/features/audit-logs/api";
import { useAuditLogs } from "@/features/audit-logs/hooks";

jest.mock("@/features/audit-logs/api", () => ({
  auditLogsApi: { list: jest.fn() },
}));

const mocked = auditLogsApi as unknown as { list: jest.Mock };

describe("audit-logs hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("useAuditLogs loads and refreshes", async () => {
    mocked.list.mockResolvedValue([{ id: "1", action: "DENY" }]);
    const { result } = renderHook(() => useAuditLogs({ resource: "AUTH" }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual([{ id: "1", action: "DENY" }]);
    expect(mocked.list).toHaveBeenCalledWith({ resource: "AUTH" });
    mocked.list.mockResolvedValue([]);
    await act(async () => {
      await result.current.refresh();
    });
    expect(result.current.data).toEqual([]);
  });

  it("useAuditLogs surfaces errors", async () => {
    mocked.list.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useAuditLogs());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe("boom");
  });
});
