import { userConfigsApi } from "@/features/user-configs/api";
import { consoleApi } from "@/lib/console";

jest.mock("@/lib/console", () => ({
  consoleApi: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mocked = consoleApi as unknown as {
  get: jest.Mock;
  post: jest.Mock;
  patch: jest.Mock;
};

const P = "11111111-1111-1111-1111-111111111111";
const U1 = "22222222-2222-2222-2222-222222222222";
const U2 = "33333333-3333-3333-3333-333333333333";

describe("userConfigsApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lists configs for the current user", async () => {
    mocked.get.mockResolvedValue([]);
    await userConfigsApi.list();
    expect(mocked.get).toHaveBeenCalledWith(expect.stringContaining("/user-configs"));
  });

  it("lists configs for an explicit user", async () => {
    mocked.get.mockResolvedValue([]);
    await userConfigsApi.list(U1);
    expect(mocked.get.mock.calls[0][0]).toContain(`user_id=${U1}`);
  });

  it("reads a config by key", async () => {
    mocked.get.mockResolvedValue({ key: "is_talko_enabled" });
    await userConfigsApi.getByKey("is_talko_enabled");
    expect(mocked.get.mock.calls[0][0]).toContain("key=is_talko_enabled");
  });

  it("creates a config", async () => {
    mocked.post.mockResolvedValue({});
    await userConfigsApi.create({ user_id: U1, key: "is_talko_enabled", value: true });
    expect(mocked.post).toHaveBeenCalledWith(expect.stringContaining("/user-config"), {
      user_id: U1,
      key: "is_talko_enabled",
      value: true,
    });
  });

  it("upserts flags for multiple users", async () => {
    mocked.patch.mockResolvedValue([]);
    await userConfigsApi.upsert(P, [U1, U2], { is_talko_enabled: true });
    const url: string = mocked.patch.mock.calls[0][0] as string;
    expect(url).toContain(`/user-configs/${P}`);
    expect(url).toContain(`user_ids=${U1}`);
    expect(url).toContain(`user_ids=${U2}`);
    expect(mocked.patch.mock.calls[0][1]).toEqual({ is_talko_enabled: true });
  });
});
