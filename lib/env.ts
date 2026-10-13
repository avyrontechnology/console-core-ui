import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_CONSOLE_BASE_URL: z.string().url(),
});

export type AppEnv = z.infer<typeof envSchema>;

let cached: AppEnv | null = null;

/** Validated, typed access to public env. Throws at boot on misconfig. */
export function getEnv(): AppEnv {
  if (cached) return cached;
  cached = envSchema.parse({
    NEXT_PUBLIC_CONSOLE_BASE_URL: process.env.NEXT_PUBLIC_CONSOLE_BASE_URL,
  });
  return cached;
}
