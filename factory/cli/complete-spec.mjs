#!/usr/bin/env node

/**
 * CLI Tool: Verifies all tasks and harnesses, then transitions an active spec to completed.
 * Usage: npm run factory:complete <feature-slug>
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { runFactoryLoop } from "../loops/factory-loop.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");

const slug = process.argv[2];

if (!slug) {
  console.error("❌ Error: Missing feature slug.");
  console.error("Usage: npm run factory:complete <feature-slug>");
  process.exit(1);
}

const activeDir = path.join(REPO_ROOT, "specs/active", slug);
const completedDir = path.join(REPO_ROOT, "specs/completed", slug);

if (!fs.existsSync(activeDir)) {
  console.error(`❌ Error: Active spec not found at: specs/active/${slug}`);
  process.exit(1);
}

// 1. Check tasks.md for uncompleted tasks
const tasksPath = path.join(activeDir, "tasks.md");
if (fs.existsSync(tasksPath)) {
  const tasksContent = fs.readFileSync(tasksPath, "utf-8");
  const uncompleted = tasksContent.match(/- \[ \]/g);
  if (uncompleted && uncompleted.length > 0) {
    console.error(`❌ Error: tasks.md still has ${uncompleted.length} uncompleted task(s)!`);
    console.error("Complete all checklist items before marking the feature complete.");
    process.exit(1);
  }
}

// 2. Run the Factory Loop
console.log("🚦 Running Factory Loop verification before sign-off...");
runFactoryLoop(slug).then((exitCode) => {
  if (exitCode !== 0) {
    console.error("❌ Cannot complete feature: Factory Loop failed verification.");
    process.exit(1);
  }

  // 3. Update status in spec.md
  const specPath = path.join(activeDir, "spec.md");
  if (fs.existsSync(specPath)) {
    let specContent = fs.readFileSync(specPath, "utf-8");
    specContent = specContent.replace(/\*\*Status\*\* \| `[A-Za-z ]+`/, "**Status** | `Verified`");
    fs.writeFileSync(specPath, specContent, "utf-8");
  }

  // 4. Move directory to completed
  fs.mkdirSync(path.dirname(completedDir), { recursive: true });
  fs.renameSync(activeDir, completedDir);

  console.log("=======================================================");
  console.log(`🎉 [Software Factory] Feature successfully verified and archived!`);
  console.log(`   📂 Moved to: specs/completed/${slug}/`);
  console.log("=======================================================\n");
  process.exit(0);
});
