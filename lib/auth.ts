import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { ApiClient } from "./api-client";
import { ENDPOINTS } from "./endpoints";
import { logger } from "./logger";
import type { HomepageData, TokenPair } from "@/types/api";

const credentialsSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

/** Backend login + hydrate. Single place that touches credentials. */
async function authorizeWithConsole(
  email: string,
  password: string,
): Promise<HomepageData & { accessToken: string }> {
  const client = new ApiClient();
  const token = await client.post<TokenPair>(ENDPOINTS.LOGIN(), {
    credential: email,
    password,
  });
  const authed = new ApiClient({
    getToken: () => token.access_token,
  });
  const homepage = await authed.get<HomepageData>(ENDPOINTS.HOMEPAGE_DETAILS());
  return { ...homepage, accessToken: token.access_token };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: 2 * 24 * 60 * 60 },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;
        try {
          const data = await authorizeWithConsole(parsed.data.email, parsed.data.password);
          return {
            id: data.user_info.id,
            email: data.user_info.email,
            name: data.user_info.name,
            accessToken: data.accessToken,
            permissions: data.user_permissions,
            partnerInfo: data.partner_info,
            servicesInfo: data.services_info,
            userInfo: data.user_info,
          };
        } catch {
          logger.warn("Console login failed");
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as Record<string, unknown>;
        token.accessToken = u["accessToken"] as string;
        token.permissions = (u["permissions"] as string[]) ?? [];
        token.partnerInfo = (u["partnerInfo"] as Record<string, unknown>) ?? null;
        token.servicesInfo = (u["servicesInfo"] as Record<string, unknown>) ?? null;
        token.userInfo = u["userInfo"] as HomepageData["user_info"];
      }
      return token;
    },
    session: ({ session, token }) => {
      const t = token as unknown as {
        accessToken?: string;
        permissions?: string[];
        partnerInfo?: Record<string, unknown> | null;
        servicesInfo?: Record<string, unknown> | null;
        userInfo?: HomepageData["user_info"];
        sub?: string;
      };
      return {
        ...session,
        accessToken: t.accessToken ?? "",
        permissions: t.permissions ?? [],
        partnerInfo: t.partnerInfo ?? null,
        servicesInfo: t.servicesInfo ?? null,
        user: {
          id: t.userInfo?.id ?? t.sub ?? "",
          email: t.userInfo?.email ?? session.user?.email ?? "",
          name: t.userInfo?.name ?? session.user?.name ?? "",
        },
      };
    },
  },
});
