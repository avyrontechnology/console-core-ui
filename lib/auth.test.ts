/**
 * Exercises the NextAuth config in lib/auth (authorize + jwt/session
 * callbacks) without loading next-auth internals.
 */
function capturedConfig(): { config?: Record<string, unknown> } {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (globalThis as any).__authTestCaptured;
}

jest.mock("next-auth", () => ({
  __esModule: true,
  default: jest.fn((config: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((globalThis as any).__authTestCaptured ??= {}).config = config;
    return {};
  }),
}));

jest.mock("next-auth/providers/credentials", () => ({
  __esModule: true,
  default: jest.fn((options: unknown) => options),
}));

jest.mock("@/lib/console-auth", () => ({
  authorizeWithConsole: jest.fn(),
}));

import { authorizeWithConsole } from "@/lib/console-auth";

import "@/lib/auth";

const mockedBackend = authorizeWithConsole as jest.Mock;

interface Provider {
  authorize: (credentials: unknown) => Promise<unknown>;
}

interface Callbacks {
  jwt: (args: { token: unknown; user?: unknown }) => unknown;
  session: (args: { session: unknown; token: unknown }) => unknown;
}

function config() {
  const store = capturedConfig();
  const providers = store.config?.["providers"] as Provider[];
  const callbacks = store.config?.["callbacks"] as Callbacks;
  return { provider: providers[0], callbacks };
}

describe("auth config", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("authorize returns null on bad input", async () => {
    const { provider } = config();
    await expect(provider.authorize({})).resolves.toBeNull();
    expect(mockedBackend).not.toHaveBeenCalled();
  });

  it("authorize maps backend profile to session user", async () => {
    mockedBackend.mockResolvedValue({
      accessToken: "tok",
      user_info: { id: "1", email: "a@x.com", name: "A" },
      user_permissions: ["console:x"],
      partner_info: { id: "p" },
      services_info: null,
    });
    const { provider } = config();
    const user = (await provider.authorize({
      email: "a@x.com",
      password: "secret123",
    })) as Record<string, unknown>;
    expect(user["id"]).toBe("1");
    expect(user["accessToken"]).toBe("tok");
    expect(user["permissions"]).toEqual(["console:x"]);
  });

  it("authorize returns null on backend failure", async () => {
    mockedBackend.mockRejectedValue(new Error("down"));
    const { provider } = config();
    await expect(
      provider.authorize({ email: "a@x.com", password: "secret123" }),
    ).resolves.toBeNull();
  });

  it("jwt/session callbacks carry token fields", () => {
    const { callbacks } = config();
    const user = {
      id: "1",
      accessToken: "tok",
      permissions: ["console:x"],
      partnerInfo: null,
      servicesInfo: null,
      userInfo: { id: "1", email: "a@x.com", name: "A" },
    };
    const token = callbacks.jwt({ token: {}, user });
    expect((token as Record<string, unknown>)["accessToken"]).toBe("tok");
    const session = callbacks.session({
      session: { user: {} },
      token,
    }) as Record<string, unknown>;
    expect(session["accessToken"]).toBe("tok");
    expect(session["permissions"]).toEqual(["console:x"]);
  });
});
