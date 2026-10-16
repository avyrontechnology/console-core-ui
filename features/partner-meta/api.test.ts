import { partnerMetaApi } from "@/features/partner-meta/api";
import { consoleApi } from "@/lib/console";

jest.mock("@/lib/console", () => ({
  consoleApi: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  },
}));

const mocked = consoleApi as unknown as {
  get: jest.Mock;
  post: jest.Mock;
  patch: jest.Mock;
};

describe("partnerMetaApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("gets meta", async () => {
    mocked.get.mockResolvedValue({});
    await partnerMetaApi.get("p1");
    expect(mocked.get).toHaveBeenCalledWith(
      expect.stringContaining("/partner_meta_data/partner/p1"),
    );
  });

  it("creates and updates meta", async () => {
    mocked.post.mockResolvedValue({});
    mocked.patch.mockResolvedValue({});
    await partnerMetaApi.create("p1", { type_of_business: "Retail" });
    expect(mocked.post).toHaveBeenCalledWith(
      expect.stringContaining("/partner_meta_data/p1"),
      expect.objectContaining({ type_of_business: "Retail" }),
    );
    await partnerMetaApi.update("p1", { years_in_business: 3 });
    expect(mocked.patch).toHaveBeenCalledWith(
      expect.stringContaining("/partner_meta_data/p1"),
      expect.objectContaining({ years_in_business: 3 }),
    );
  });
});
