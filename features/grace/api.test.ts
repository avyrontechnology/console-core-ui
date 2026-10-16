import { graceApi } from "@/features/grace/api";
import { consoleApi } from "@/lib/console";

jest.mock("@/lib/console", () => ({
  consoleApi: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const mocked = consoleApi as unknown as {
  get: jest.Mock;
  post: jest.Mock;
};

describe("graceApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches status", async () => {
    mocked.get.mockResolvedValue({});
    await graceApi.status("p1");
    expect(mocked.get).toHaveBeenCalledWith(expect.stringContaining("/grace/status"));
    expect(mocked.get).toHaveBeenCalledWith(expect.stringContaining("partner_id=p1"));
  });

  it("grants grace", async () => {
    mocked.post.mockResolvedValue({});
    await graceApi.grant({ partner_id: "p1", granted_days: 7, remark: "ok" });
    expect(mocked.post).toHaveBeenCalledWith(
      expect.stringContaining("/grace/grant"),
      expect.objectContaining({ partner_id: "p1" }),
    );
  });
});
