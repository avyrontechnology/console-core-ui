import { partnersApi } from "@/features/partners/api";
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
  delete: jest.Mock;
};

describe("partnersApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lists via POST filter body", async () => {
    mocked.post.mockResolvedValue([]);
    await partnersApi.list();
    expect(mocked.post).toHaveBeenCalledWith(expect.stringContaining("/partners"), {});
  });

  it("builds detail/update/delete/toggle URLs from id", async () => {
    const id = "11111111-1111-1111-1111-111111111111";
    mocked.get.mockResolvedValue({});
    mocked.patch.mockResolvedValue({});
    mocked.delete.mockResolvedValue(undefined);
    await partnersApi.getById(id);
    await partnersApi.update(id, { name: "X" });
    await partnersApi.remove(id);
    await partnersApi.toggleActivation(id, false);
    expect(mocked.get).toHaveBeenCalledWith(expect.stringContaining(id));
    expect(mocked.patch).toHaveBeenCalledWith(expect.stringContaining(id), { name: "X" });
    expect(mocked.delete).toHaveBeenCalledWith(expect.stringContaining(id));
    expect(mocked.patch).toHaveBeenCalledWith(expect.stringContaining("toggle_activation"), {
      is_active: false,
    });
  });

  it("creates via create endpoint", async () => {
    mocked.post.mockResolvedValue({});
    await partnersApi.create({
      name: "Acme",
      company_legal_name: "Acme Corp",
    });
    expect(mocked.post).toHaveBeenCalledWith(
      expect.stringContaining("/create_partner"),
      expect.objectContaining({ name: "Acme" }),
    );
  });
});
