import { consoleApi, setSharedToken } from "@/lib/console";

jest.mock("next-auth/react", () => ({
  signOut: jest.fn(),
  useSession: () => ({ data: null, status: "unauthenticated" }),
}));

jest.mock("@/lib/api-client", () => ({
  ApiClient: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockResolvedValue("ok"),
  })),
}));

describe("consoleApi", () => {
  it("delegates calls to the shared client", async () => {
    setSharedToken("tok");
    await expect(consoleApi.get<string>("http://x")).resolves.toBe("ok");
  });
});
