describe("getEnv", () => {
  const ORIGINAL = process.env.NEXT_PUBLIC_CONSOLE_BASE_URL;

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_CONSOLE_BASE_URL = ORIGINAL;
  });

  it("throws on missing base URL", async () => {
    delete process.env.NEXT_PUBLIC_CONSOLE_BASE_URL;
    const fresh = (await import("@/lib/env")) as typeof import("@/lib/env");
    expect(() => fresh.getEnv()).toThrow();
  });

  it("returns validated env", async () => {
    process.env.NEXT_PUBLIC_CONSOLE_BASE_URL = "http://localhost:8000";
    const fresh = (await import("@/lib/env")) as typeof import("@/lib/env");
    expect(fresh.getEnv().NEXT_PUBLIC_CONSOLE_BASE_URL).toBe("http://localhost:8000");
  });
});
