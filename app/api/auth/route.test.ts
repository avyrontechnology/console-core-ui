jest.mock("next-auth", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    handlers: { GET: jest.fn(), POST: jest.fn() },
  })),
}));

jest.mock("next-auth/providers/credentials", () => ({
  __esModule: true,
  default: jest.fn((options: unknown) => options),
}));

jest.mock("@/lib/console-auth", () => ({
  authorizeWithBackend: jest.fn(),
}));

describe("auth route handlers", () => {
  it("re-exports NextAuth handlers", async () => {
    const route = await import("@/app/api/auth/[...nextauth]/route");
    expect(typeof route.GET).toBe("function");
    expect(typeof route.POST).toBe("function");
  });
});
