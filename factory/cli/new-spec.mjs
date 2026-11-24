#!/usr/bin/env node

/**
 * CLI Tool: Scaffolds a new active specification and task checklist from templates.
 * Usage: npm run factory:new <feature-slug>
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");

const slug = process.argv[2];

if (!slug) {
  console.error("❌ Error: Missing feature slug.");
  console.error("Usage: npm run factory:new <feature-slug>");
  console.error("Example: npm run factory:new audit-logs-export");
  process.exit(1);
}

// Clean slug
const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
const targetDir = path.join(REPO_ROOT, "specs/active", cleanSlug);

if (fs.existsSync(targetDir)) {
  console.error(`❌ Error: Feature spec directory already exists at: specs/active/${cleanSlug}`);
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });

// Read templates
const specTemplatePath = path.join(REPO_ROOT, "specs/templates/feature-spec.md");
const tasksTemplatePath = path.join(REPO_ROOT, "specs/templates/tasks.md");

if (!fs.existsSync(specTemplatePath) || !fs.existsSync(tasksTemplatePath)) {
  console.error("❌ Error: Templates not found in specs/templates/");
  process.exit(1);
}

let specContent = fs.readFileSync(specTemplatePath, "utf-8");
let tasksContent = fs.readFileSync(tasksTemplatePath, "utf-8");

// Interpolate
specContent = specContent.replace(/\[feature-slug\]/g, cleanSlug);
specContent = specContent.replace(/\[Feature Name\]/g, cleanSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "));

tasksContent = tasksContent.replace(/\[feature-slug\]/g, cleanSlug);
tasksContent = tasksContent.replace(/\[Feature Name\]/g, cleanSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "));

fs.writeFileSync(path.join(targetDir, "spec.md"), specContent, "utf-8");
fs.writeFileSync(path.join(targetDir, "tasks.md"), tasksContent, "utf-8");

console.log("=======================================================");
console.log(`✨ [Software Factory] Scaffolded active specification:`);
console.log(`   📂 Directory: specs/active/${cleanSlug}/`);
console.log(`   📄 Spec:      specs/active/${cleanSlug}/spec.md`);
console.log(`   📋 Tasks:     specs/active/${cleanSlug}/tasks.md`);
console.log("=======================================================");
console.log("\nNext Steps:");
console.log(`1. Open specs/active/${cleanSlug}/spec.md and complete the OpenAPI contract & Shadcn manifest.`);
console.log(`2. Validate your spec: npm run factory:spec specs/active/${cleanSlug}`);
console.log(`3. Run the factory loop as you build: npm run factory:loop ${cleanSlug}\n`);
