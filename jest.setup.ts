import "@testing-library/jest-dom";

// Default test env (per-test overrides via process.env + jest.resetModules).
process.env.NEXT_PUBLIC_CONSOLE_BASE_URL ??= "http://localhost:8000";
