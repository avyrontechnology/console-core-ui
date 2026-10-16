import { auditLogsApi } from "@/features/audit-logs/api";
import { consoleApi } from "@/lib/console";

jest.mock("@/lib/console", () => ({
  consoleApi: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mocked = consoleApi as unknown as { get: jest.Mock };

describe("auditLogsApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lists without filters", async () => {
    mocked.get.mockResolvedValue([]);
    await auditLogsApi.list();
    expect(mocked.get).toHaveBeenCalledWith(expect.stringContaining("/audit-logs"));
  });

  it("passes resource/action filters", async () => {
    mocked.get.mockResolvedValue([]);
    await auditLogsApi.list({ resource: "AUTH", action: "DENY", limit: 50 });
    const calledUrl: string = mocked.get.mock.calls[0][0] as string;
    expect(calledUrl).toContain("resource=AUTH");
    expect(calledUrl).toContain("action=DENY");
    expect(calledUrl).toContain("limit=50");
  });
});
