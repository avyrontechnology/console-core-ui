/* eslint-disable no-console */
// Central logger — the ONLY place console.* may appear.
type Level = "debug" | "info" | "warn" | "error";

const ENABLED: Record<Level, boolean> = {
  debug: process.env.NODE_ENV === "development",
  info: true,
  warn: true,
  error: true,
};

function emit(level: Level, message: string, context?: Record<string, unknown>) {
  if (!ENABLED[level]) return;
  const payload = context ? { message, ...context } : { message };
  if (level === "error") console.error(JSON.stringify(payload));
  else if (level === "warn") console.warn(JSON.stringify(payload));
  else console.log(JSON.stringify(payload));
}

/** Structured logger. Never pass tokens, passwords, or PII as context. */
export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => emit("debug", message, context),
  info: (message: string, context?: Record<string, unknown>) => emit("info", message, context),
  warn: (message: string, context?: Record<string, unknown>) => emit("warn", message, context),
  error: (message: string, context?: Record<string, unknown>) => emit("error", message, context),
};
