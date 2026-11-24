#!/usr/bin/env node

/**
 * Spec Harness: Validates specification files against repository standards.
 * Verifies required sections, OpenAPI endpoints, RBAC slugs, and shadcn manifest.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");

const MANDATORY_SECTIONS = [
  "Problem Statement & Scope",
  "Backend Contract & Data Models",
  "Strict Shadcn UI Component Manifest",
  "UI/UX State Matrix",
  "Acceptance Criteria",
];

export function validateSpec(specPath) {
  const issues = [];
  if (!fs.existsSync(specPath)) {
    return { valid: false, issues: [`Spec file does not exist: ${specPath}`] };
  }

  const content = fs.readFileSync(specPath, "utf-8");

  // Check mandatory sections
  for (const section of MANDATORY_SECTIONS) {
    if (!content.includes(section)) {
      issues.push(`Missing required section: "## ${section}"`);
    }
  }

  // Check RBAC slug format
  const rbacMatches = content.match(/console:[a-z0-9_]+/g);
  if (!rbacMatches || rbacMatches.length === 0) {
    issues.push("Spec must define at least one valid RBAC slug matching 'console:<action>'");
  }

  // Check Shadcn manifest
  if (!content.includes("@/components/ui/")) {
    issues.push("Spec must define imports from '@/components/ui/' in the Shadcn UI Component Manifest");
  }

  // Verify referenced endpoints in lib/endpoints.ts
  const endpointMatches = content.match(/ENDPOINTS\.([A-Z0-9_]+)/g);
  if (endpointMatches) {
    const endpointsFile = path.join(REPO_ROOT, "lib/endpoints.ts");
    const endpointsContent = fs.existsSync(endpointsFile) ? fs.readFileSync(endpointsFile, "utf-8") : "";
    for (const match of endpointMatches) {
      const endpointName = match.replace("ENDPOINTS.", "");
      if (!endpointsContent.includes(`${endpointName}:`)) {
        issues.push(`Referenced endpoint ENDPOINTS.${endpointName} is not yet registered in lib/endpoints.ts`);
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    specPath,
  };
}

// CLI execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const target = process.argv[2];
  let specsToTest = [];

  if (target) {
    const candidate = path.isAbsolute(target) ? target : path.resolve(REPO_ROOT, target);
    if (fs.statSync(candidate).isDirectory()) {
      specsToTest.push(path.join(candidate, "spec.md"));
    } else {
      specsToTest.push(candidate);
    }
  } else {
    // Check all active specs
    const activeDir = path.join(REPO_ROOT, "specs/active");
    if (fs.existsSync(activeDir)) {
      const entries = fs.readdirSync(activeDir);
      for (const entry of entries) {
        const specFile = path.join(activeDir, entry, "spec.md");
        if (fs.existsSync(specFile)) {
          specsToTest.push(specFile);
        }
      }
    }
    // Also validate completed specs
    const completedDir = path.join(REPO_ROOT, "specs/completed");
    if (fs.existsSync(completedDir)) {
      const entries = fs.readdirSync(completedDir);
      for (const entry of entries) {
        const specFile = path.join(completedDir, entry, "spec.md");
        if (fs.existsSync(specFile)) {
          specsToTest.push(specFile);
        }
      }
    }
  }

  if (specsToTest.length === 0) {
    console.log("ℹ️  No specs found to validate.");
    process.exit(0);
  }

  console.log(`🔍 [Spec Harness] Validating ${specsToTest.length} spec(s)...`);
  let hasErrors = false;

  for (const spec of specsToTest) {
    const result = validateSpec(spec);
    const relPath = path.relative(REPO_ROOT, spec);
    if (result.valid) {
      console.log(`  ✅ ${relPath}: Valid`);
    } else {
      hasErrors = true;
      console.error(`  ❌ ${relPath}:`);
      for (const issue of result.issues) {
        console.error(`     - ${issue}`);
      }
    }
  }

  if (hasErrors) {
    process.exit(1);
  } else {
    console.log("✨ [Spec Harness] All specifications passed validation!");
  }
}
