/** @type {import('jest').Config} */
/* eslint-disable @typescript-eslint/no-require-imports -- jest config must be CJS (no ts-node) */
const nextJest = require("next/jest.js");

const createJestConfig = nextJest({ dir: "./" });

const config = {
  rootDir: __dirname,
  coverageProvider: "v8",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "features/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "store/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  coverageThreshold: {
    // Functions stay at 80 (not 85): trivial shell glue (route re-exports,
    // layouts) carries no logic worth mock-heavy tests. Revisit if logic
    // ever moves into shell files.
    global: {
      branches: 60,
      functions: 80,
      lines: 85,
      statements: 85,
    },
  },
};

module.exports = createJestConfig(config);
