import { apiKeysApi } from "@/features/api-keys/api";
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

const mocked = consoleApi as unknown as {
  get: jest.Mock;
  post: jest.Mock;
  patch: jest.Mock;
  put: jest.Mock;
};

describe("apiKeysApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("reads current key", async () => {
    mocked.get.mockResolvedValue({ id: "1" });
    await apiKeysApi.current();
    expect(mocked.get).toHaveBeenCalledWith(expect.stringContaining("/get_api_key"));
  });

  it("rotates, updates and inactivates", async () => {
    mocked.post.mockResolvedValue({ id: "2" });
    mocked.patch.mockResolvedValue({ id: "2" });
    mocked.put.mockResolvedValue({ id: "2" });
    await apiKeysApi.rotate({ scopes: ["console:get_all_users"] });
    await apiKeysApi.update({ scopes: [] });
    await apiKeysApi.inactivate();
    expect(mocked.post).toHaveBeenCalledWith(expect.stringContaining("/generate_api_key"), {
      scopes: ["console:get_all_users"],
    });
    expect(mocked.patch).toHaveBeenCalledWith(expect.stringContaining("/api_key"), { scopes: [] });
    expect(mocked.put).toHaveBeenCalledWith(expect.stringContaining("/inactivate_api_key"));
  });
});
