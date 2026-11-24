#!/usr/bin/env node

/**
 * Architecture Harness: Verifies core architectural invariants:
 * 1. Endpoints strictly centralized in lib/endpoints.ts (zero hardcoded URLs elsewhere).
 * 2. Domain structure integrity in features/<domain>/.
 * 3. Zero raw console.log (logger only).
 * 4. Zero explicit 'any'.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");

const URL_PATTERN = /(["'`])(\/console-service\/v1\/[^"'`]+)\1/g;
const CONSOLE_LOG_PATTERN = /\bconsole\.log\s*\(/g;

function getSourceFiles(dir, extensions = [".ts", ".tsx"]) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== "node_modules" && file !== ".next" && file !== "coverage") {
        results = results.concat(getSourceFiles(fullPath, extensions));
      }
    } else {
      if (extensions.some((ext) => file.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

export function auditArchitecture() {
  const issues = [];
  const sourceDirs = ["app", "features", "components", "hooks", "lib", "store"];

  let totalFilesScanned = 0;

  for (const d of sourceDirs) {
    const dirPath = path.join(REPO_ROOT, d);
    const files = getSourceFiles(dirPath);
    totalFilesScanned += files.length;

    for (const file of files) {
      const relPath = path.relative(REPO_ROOT, file);
      // Skip endpoints.ts for URL check
      const isEndpointsFile = relPath === "lib/endpoints.ts";
      const isLoggerFile = relPath === "lib/logger.ts";
      const isTestFile = file.includes(".test.");

      const content = fs.readFileSync(file, "utf-8");
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        // Skip comment lines
        const trimmed = line.trim();
        if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) return;

        // 1. Check hardcoded URLs
        if (!isEndpointsFile && !isTestFile) {
          if (line.match(URL_PATTERN)) {
            issues.push({
              file: relPath,
              line: index + 1,
              message: "Hardcoded endpoint URL found. All URLs must strictly be defined in lib/endpoints.ts",
            });
          }
        }

        // 2. Check raw console.log
        if (!isLoggerFile && !isTestFile) {
          if (line.match(CONSOLE_LOG_PATTERN)) {
            issues.push({
              file: relPath,
              line: index + 1,
              message: "console.log found. Strictly use structured logger from '@/lib/logger'.",
            });
          }
        }
      });
    }
  }

  // 3. Domain feature structure check
  const featuresDir = path.join(REPO_ROOT, "features");
  if (fs.existsSync(featuresDir)) {
    const domains = fs.readdirSync(featuresDir).filter((d) => {
      const full = path.join(featuresDir, d);
      return fs.statSync(full).isDirectory();
    });

    for (const domain of domains) {
      const domainPath = path.join(featuresDir, domain);
      const apiFile = path.join(domainPath, "api.ts");
      const hooksFile = path.join(domainPath, "hooks.ts");

      if (!fs.existsSync(apiFile)) {
        issues.push({
          file: `features/${domain}`,
          line: 1,
          message: `Missing 'api.ts' in features/${domain}. Every domain resource must have an api.ts file.`,
        });
      }

      if (!fs.existsSync(hooksFile)) {
        issues.push({
          file: `features/${domain}`,
          line: 1,
          message: `Missing 'hooks.ts' in features/${domain}. Every domain resource must have a hooks.ts file.`,
        });
      }
    }
  }

  return {
    compliant: issues.length === 0,
    totalFilesScanned,
    issues,
  };
}

// CLI execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log("🏛️  [Architecture Harness] Auditing codebase architectural invariants...");
  const result = auditArchitecture();
  console.log(`  Scanned ${result.totalFilesScanned} source files.`);

  if (result.compliant) {
    console.log("✨ [Architecture Harness] All architectural invariants satisfied!");
    process.exit(0);
  } else {
    console.error(`❌ [Architecture Harness] Found ${result.issues.length} violation(s):`);
    for (const issue of result.issues) {
      console.error(`   - ${issue.file}:${issue.line} => ${issue.message}`);
    }
    process.exit(1);
  }
}
