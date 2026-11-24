#!/usr/bin/env node

/**
 * Shadcn Harness: Audits feature code and page components to strictly enforce
 * shadcn UI component usage and ban ad-hoc raw HTML tags.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");

const SCAN_DIRS = ["features", "app/(admin)"];

// Raw tags that should be replaced with shadcn components
const FORBIDDEN_RAW_TAG_PATTERNS = [
  {
    tag: "<button",
    component: "Button",
    importPath: "@/components/ui/button",
    allowedIn: ["components/ui/"],
  },
  {
    tag: "<input",
    component: "Input",
    importPath: "@/components/ui/input",
    allowedIn: ["components/ui/"],
  },
  {
    tag: "<textarea",
    component: "Textarea",
    importPath: "@/components/ui/textarea",
    allowedIn: ["components/ui/"],
  },
  {
    tag: "<select",
    component: "Select / NativeSelect",
    importPath: "@/components/ui/select",
    allowedIn: ["components/ui/"],
  },
];

function getFiles(dir, extensions = [".tsx"]) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== "node_modules" && file !== ".next" && file !== "coverage") {
        results = results.concat(getFiles(fullPath, extensions));
      }
    } else {
      if (extensions.some((ext) => file.endsWith(ext)) && !file.includes(".test.")) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

export function auditShadcnCompliance(targetDir = null) {
  const issues = [];
  let dirsToScan = [];
  if (Array.isArray(targetDir)) {
    dirsToScan = targetDir;
  } else if (targetDir) {
    dirsToScan = [targetDir];
  } else {
    dirsToScan = SCAN_DIRS.map((d) => path.join(REPO_ROOT, d));
  }

  let totalFilesScanned = 0;

  for (const scanDir of dirsToScan) {
    const files = getFiles(scanDir);
    totalFilesScanned += files.length;

    for (const file of files) {
      const relPath = path.relative(REPO_ROOT, file);
      const content = fs.readFileSync(file, "utf-8");
      const lines = content.split("\n");

      // Check for raw HTML tags
      lines.forEach((line, index) => {
        // Skip comment lines
        const trimmed = line.trim();
        if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) return;

        for (const rule of FORBIDDEN_RAW_TAG_PATTERNS) {
          if (line.includes(rule.tag)) {
            // Check if this file is explicitly allowed
            const isAllowed = rule.allowedIn.some((allowed) => relPath.includes(allowed));
            if (!isAllowed) {
              issues.push({
                file: relPath,
                line: index + 1,
                message: `Found raw '${rule.tag}'. Strictly use shadcn <${rule.component}> from '${rule.importPath}'.`,
              });
            }
          }
        }
      });
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
  const targetArg = process.argv[2];
  const targetPath = targetArg
    ? path.isAbsolute(targetArg)
      ? targetArg
      : path.resolve(REPO_ROOT, targetArg)
    : null;

  console.log("🎨 [Shadcn Harness] Auditing codebase for strict shadcn UI component usage...");
  const result = auditShadcnCompliance(targetPath);

  console.log(`  Scanned ${result.totalFilesScanned} UI component files.`);

  if (result.compliant) {
    console.log("✨ [Shadcn Harness] 100% compliant with strict shadcn UI components!");
    process.exit(0);
  } else {
    console.error(`❌ [Shadcn Harness] Found ${result.issues.length} violation(s):`);
    for (const issue of result.issues) {
      console.error(`   - ${issue.file}:${issue.line} => ${issue.message}`);
    }
    process.exit(1);
  }
}
