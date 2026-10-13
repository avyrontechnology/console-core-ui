/** @type {import('jest').Config} */
/* eslint-disable @typescript-eslint/no-require-imports -- jest config must be CJS (no ts-node) */
const nextJest = require("next/jest.js");

const createJestConfig = nextJest({ dir: "./" });

const config = {
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
    global: {
      branches: 60,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};

module.exports = createJestConfig(config);
