#!/usr/bin/env node

/**
 * Test Harness: Executes TypeCheck, ESLint, and Jest test suite with coverage thresholds.
 */

import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");

export function runTestHarness(options = {}) {
  const steps = [
    { name: "TypeScript Check", command: "npm run typecheck" },
    { name: "ESLint", command: "npm run lint" },
    { name: "Jest Tests & Coverage", command: "npm run test" },
  ];

  const results = [];
  let allPassed = true;

  for (const step of steps) {
    console.log(`🧪 [Test Harness] Running ${step.name}...`);
    try {
      const output = execSync(step.command, {
        cwd: REPO_ROOT,
        stdio: options.silent ? "pipe" : "inherit",
        encoding: "utf-8",
      });
      results.push({ name: step.name, passed: true, output });
    } catch (error) {
      allPassed = false;
      results.push({
        name: step.name,
        passed: false,
        error: error.message,
        output: error.stdout ? error.stdout.toString() : "",
      });
      if (options.bail) break;
    }
  }

  return {
    allPassed,
    results,
  };
}

// CLI execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log("🚦 [Test Harness] Executing quality verification pipeline...");
  const { allPassed } = runTestHarness();

  if (allPassed) {
    console.log("✨ [Test Harness] All verification gates passed!");
    process.exit(0);
  } else {
    console.error("❌ [Test Harness] One or more verification gates failed.");
    process.exit(1);
  }
}
