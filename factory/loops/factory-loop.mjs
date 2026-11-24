#!/usr/bin/env node

/**
 * Factory Loop: Orchestrates all 4 software factory harnesses into a unified
 * feedback loop. Generates harness-report.json for autonomous self-correction.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { validateSpec } from "../harnesses/spec-harness.mjs";
import { auditShadcnCompliance } from "../harnesses/shadcn-harness.mjs";
import { auditArchitecture } from "../harnesses/arch-harness.mjs";
import { runTestHarness } from "../harnesses/test-harness.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");

export async function runFactoryLoop(featureSlug = null) {
  const timestamp = new Date().toISOString();
  console.log("=======================================================");
  console.log("🔄 [Software Factory] Running Verification Loop");
  console.log(`   Time:    ${timestamp}`);
  if (featureSlug) console.log(`   Feature: ${featureSlug}`);
  console.log("=======================================================\n");

  const report = {
    timestamp,
    featureSlug: featureSlug || "all",
    allPassed: true,
    stages: {},
  };

  // Stage 1: Spec Harness
  console.log("1️⃣  STAGE 1: Spec Harness");
  let specPath = null;
  if (featureSlug) {
    const candidateActive = path.join(REPO_ROOT, "specs/active", featureSlug, "spec.md");
    const candidateCompleted = path.join(REPO_ROOT, "specs/completed", featureSlug, "spec.md");
    specPath = fs.existsSync(candidateActive) ? candidateActive : candidateCompleted;
  }

  if (specPath && fs.existsSync(specPath)) {
    const specResult = validateSpec(specPath);
    report.stages.specHarness = specResult;
    if (specResult.valid) {
      console.log(`   ✅ Spec valid: ${path.relative(REPO_ROOT, specPath)}`);
    } else {
      report.allPassed = false;
      console.error("   ❌ Spec validation failed:");
      specResult.issues.forEach((i) => console.error(`      - ${i}`));
    }
  } else if (featureSlug) {
    report.allPassed = false;
    report.stages.specHarness = { valid: false, issues: [`Spec not found for: ${featureSlug}`] };
    console.error(`   ❌ Spec not found: specs/active/${featureSlug}/spec.md`);
  } else {
    console.log("   ℹ️  No specific feature specified; evaluating active specs.");
    report.stages.specHarness = { valid: true, note: "General audit" };
  }

  // Extract domain/route dirs for focused feature check if available
  let targetFeatureDirs = null;
  if (specPath && fs.existsSync(specPath)) {
    const specContent = fs.readFileSync(specPath, "utf-8");
    const domainMatch = specContent.match(/\*\*Domain\*\*\s*\|\s*`([^`]+)`/);
    const routeMatch = specContent.match(/\*\*Target Route\*\*\s*\|\s*`([^`]+)`/);
    if (domainMatch || routeMatch) {
      targetFeatureDirs = [];
      if (domainMatch) targetFeatureDirs.push(path.join(REPO_ROOT, domainMatch[1]));
      if (routeMatch) {
        const routeDir = path.dirname(path.join(REPO_ROOT, routeMatch[1]));
        targetFeatureDirs.push(routeDir);
      }
    }
  }

  // Stage 2: Shadcn Component Usage Harness
  console.log("\n2️⃣  STAGE 2: Shadcn Component Harness");
  const shadcnResult = auditShadcnCompliance(targetFeatureDirs);
  report.stages.shadcnHarness = shadcnResult;
  if (shadcnResult.compliant) {
    console.log(`   ✅ 100% compliant with strict shadcn UI (${shadcnResult.totalFilesScanned} files)`);
  } else {
    report.allPassed = false;
    console.error(`   ❌ ${shadcnResult.issues.length} violations found:`);
    shadcnResult.issues.slice(0, 10).forEach((i) => {
      console.error(`      - ${i.file}:${i.line} => ${i.message}`);
    });
    if (shadcnResult.issues.length > 10) {
      console.error(`      ...and ${shadcnResult.issues.length - 10} more`);
    }
  }

  // Stage 3: Architecture & Invariants Harness
  console.log("\n3️⃣  STAGE 3: Architecture Harness");
  const archResult = auditArchitecture();
  report.stages.archHarness = archResult;
  if (archResult.compliant) {
    console.log(`   ✅ All architectural invariants satisfied (${archResult.totalFilesScanned} files)`);
  } else {
    report.allPassed = false;
    console.error(`   ❌ ${archResult.issues.length} violations found:`);
    archResult.issues.forEach((i) => {
      console.error(`      - ${i.file}:${i.line} => ${i.message}`);
    });
  }

  // Stage 4: Test & Quality Gate Harness
  console.log("\n4️⃣  STAGE 4: Quality & Test Harness");
  const testResult = runTestHarness();
  report.stages.testHarness = testResult;
  if (testResult.allPassed) {
    console.log("   ✅ TypeCheck, ESLint, and Jest (>= 85% coverage) all passed!");
  } else {
    report.allPassed = false;
    console.error("   ❌ Quality gates failed:");
    testResult.results.filter((r) => !r.passed).forEach((r) => {
      console.error(`      - ${r.name} FAILED`);
    });
  }

  // Write diagnostic report if active feature
  if (featureSlug) {
    const activeFeatureDir = path.join(REPO_ROOT, "specs/active", featureSlug);
    if (fs.existsSync(activeFeatureDir)) {
      const reportFile = path.join(activeFeatureDir, "harness-report.json");
      fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), "utf-8");
      console.log(`\n📄 Saved diagnostic report to: ${path.relative(REPO_ROOT, reportFile)}`);
    }
  }

  console.log("\n=======================================================");
  if (report.allPassed) {
    console.log("🎉 [Software Factory] ALL HARNESSES PASSED - 100% READY!");
    console.log("=======================================================\n");
    return 0;
  } else {
    console.log("⚠️  [Software Factory] LOOP ITERATION INCOMPLETE - FIX ISSUES ABOVE");
    console.log("=======================================================\n");
    return 1;
  }
}

// CLI execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const featureSlug = process.argv[2];
  runFactoryLoop(featureSlug).then((exitCode) => {
    process.exit(exitCode);
  });
}
