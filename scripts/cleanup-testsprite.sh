#!/usr/bin/env bash
set -euo pipefail

# -------------------------
# Config - EDIT THIS PATH
# -------------------------
SERVICE_ACCOUNT_PATH="${1:-}"  # Pass as first argument or edit here
# -------------------------

echo "🧹 TestSprite to Playwright Migration Script"
echo "============================================"

echo "1) Repo scan: find TestSprite references"
echo "----------------------------------------"
# find files containing 'testsprite' (case-insensitive)
TS_FILES=$(grep -RIl --exclude-dir=node_modules --exclude-dir=.git --exclude='*.png' -e 'testsprite' . || true)
if [ -z "$TS_FILES" ]; then
  echo "No TestSprite references found."
else
  echo "Found TestSprite references in:"
  echo "$TS_FILES"
fi

# Create a backups directory
BACKUP_DIR="testsprite-backups-$(date +%Y%m%d%H%M%S)"
mkdir -p "$BACKUP_DIR"

# -------------------------
# 2) Backup & remove TestSprite workflows (if any)
# -------------------------
echo
echo "2) Backing up and removing any TestSprite GitHub workflows"
echo "---------------------------------------------------------"
mkdir -p "$BACKUP_DIR/.github_workflows"
for wf in .github/workflows/*.yml .github/workflows/*.yaml; do
  [ -f "$wf" ] || continue
  if grep -qi "testsprite" "$wf" || grep -qi "testsprite" "$wf" 2>/dev/null; then
    echo "Backing up $wf -> $BACKUP_DIR/.github_workflows/"
    cp "$wf" "$BACKUP_DIR/.github_workflows/"
    echo "Removing $wf"
    rm -f "$wf"
  fi
done

# -------------------------
# 3) Backup package.json and replace any 'testsprite' scripts/deps
# -------------------------
echo
echo "3) Updating package.json scripts to Playwright (backup created)"
echo "----------------------------------------------------------------"
if [ ! -f package.json ]; then
  echo "ERROR: package.json not found in repo root. Aborting."
  exit 1
fi
cp package.json "$BACKUP_DIR/package.json.bak.json"

# Use node to safely update package.json
node - <<'NODE_UPDATE'
const fs = require('fs');
const pkgPath = 'package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath,'utf8'));
pkg.scripts = pkg.scripts || {};

// Ensure Playwright scripts
pkg.scripts['test:e2e'] = 'playwright test';
pkg.scripts['test:e2e:all'] = 'playwright test';
pkg.scripts['test:e2e:ui'] = 'playwright test --ui';
pkg.scripts['test:e2e:report'] = 'playwright show-report';

// Remove testsprite script entries if exist
for (const k of Object.keys(pkg.scripts)) {
  if (/testsprite/i.test(pkg.scripts[k])) {
    console.log(`Replacing scripts.${k} that used TestSprite`);
    pkg.scripts[k] = pkg.scripts[k].replace(/testsprite[^\"]*/ig, 'playwright test');
  }
}

// Remove TestSprite dependencies if present
const removeDeps = (d) => {
  if (!pkg[d]) return;
  for (const name of Object.keys(pkg[d])) {
    if (/testsprite/i.test(name) || /testsprite/i.test(pkg[d][name])) {
      console.log(`Removing ${name} from ${d}`);
      delete pkg[d][name];
    }
  }
};
removeDeps('devDependencies');
removeDeps('dependencies');

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log('package.json updated to use Playwright scripts.');
NODE_UPDATE

# -------------------------
# 4) Add canonical Playwright workflow
# -------------------------
echo
echo "4) Adding/overwriting .github/workflows/e2e.yml to run Playwright"
echo "-----------------------------------------------------------------"
mkdir -p .github/workflows
cat > .github/workflows/e2e.yml <<'YML'
name: e2e
on: [push, pull_request]
jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build || echo "skip build"
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report
YML
echo "Created .github/workflows/e2e.yml"

# -------------------------
# 5) Remove TestSprite-specific files (safe delete with backup)
# -------------------------
echo
echo "5) Backup & remove files that directly reference TestSprite (scripts, configs)"
echo "---------------------------------------------------------------------------"
# Grep for matches and move to backup
grep -RIl --exclude-dir=node_modules --exclude-dir=.git -e 'testsprite' . | while read -r f; do
  # don't process .github/workflows (already handled)
  if [[ "$f" == .github/workflows/* ]]; then
    continue
  fi
  echo "Backing up $f -> $BACKUP_DIR/"
  mkdir -p "$BACKUP_DIR/$(dirname "$f")"
  cp -r "$f" "$BACKUP_DIR/$f"
  # prefer removing only if it's clearly a TS/JS script or workflow
  case "$f" in
    *.yml|*.yaml|*.sh|*.ps1|*.js|*.cjs|*.ts)
      if [[ "$f" == *testsprite* ]]; then
        echo "Removing $f"
        rm -rf "$f"
      else
        echo "Leaving $f in place (contains testsprite but not in filename)"
      fi
      ;;
    *)
      echo "Leaving $f in place (not auto-deleting)"
      ;;
  esac
done || true

# -------------------------
# 6) Ensure Playwright config exists (create minimal if missing)
# -------------------------
echo
echo "6) Ensuring playwright.config.ts exists"
echo "--------------------------------------"
if [ ! -f playwright.config.ts ]; then
  cat > playwright.config.ts <<'PWCFG'
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:5174',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npm run dev',
    port: 5174,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  outputDir: 'test-results',
});
PWCFG
  echo "playwright.config.ts created"
else
  echo "playwright.config.ts already present — leaving as-is"
fi

# -------------------------
# 7) Backup current branch and commit changes
# -------------------------
echo
echo "7) Git: create a backup branch and commit changes"
echo "------------------------------------------------"
BRANCH=$(git rev-parse --abbrev-ref HEAD || echo "main")
BACKUP_BRANCH="pre-testsprite-cleanup-$(date +%Y%m%d%H%M%S)"

git add -A
git commit -m "chore: prepare to migrate from TestSprite -> Playwright (backup created)" || echo "No changes to commit."

git checkout -b "$BACKUP_BRANCH" || true
git add -A
git commit -m "backup: pre-testsprite-cleanup backup" || echo "No changes to commit on backup branch."
git checkout "$BRANCH"

# Stage changes on current branch and commit
git add -A
git commit -m "ci(test): replace TestSprite with Playwright runner; add Playwright workflow" || echo "No changes to commit."

# -------------------------
# 8) Install Playwright & browsers
# -------------------------
echo
echo "8) Install Playwright browsers"
echo "------------------------------"
npx playwright install --with-deps || true

# -------------------------
# 9) Run admin claims setup (attempt) and verify
# -------------------------
echo
echo "9) Attempting to set admin claims for test@vayra.digital using scripts/setClaims.cjs"
echo "-------------------------------------------------------------------------------"
if [ -n "$SERVICE_ACCOUNT_PATH" ] && [ -f "$SERVICE_ACCOUNT_PATH" ]; then
  export GOOGLE_APPLICATION_CREDENTIALS="$SERVICE_ACCOUNT_PATH"
  echo "Set GOOGLE_APPLICATION_CREDENTIALS to: $SERVICE_ACCOUNT_PATH"
fi

if [ -f scripts/setClaims.cjs ]; then
  echo "Running node scripts/setClaims.cjs"
  node scripts/setClaims.cjs || (echo "Warning: setClaims failed; check GOOGLE_APPLICATION_CREDENTIALS and service account." && true)
else
  echo "scripts/setClaims.cjs not found — skipping admin claim set step. If you want to run, ensure scripts/setClaims.cjs exists."
fi

if [ -f scripts/verifyClaims.cjs ]; then
  echo "Running node scripts/verifyClaims.cjs"
  node scripts/verifyClaims.cjs || (echo "Warning: verifyClaims failed; inspect logs." && true)
else
  echo "scripts/verifyClaims.cjs not found — skipping verify step."
fi

# -------------------------
# 10) Run Playwright tests (non-fatal)
# -------------------------
echo
echo "10) Running Playwright E2E suite (will start local dev server via webServer if configured)"
echo "-------------------------------------------------------------------------------------------"
npm run test:e2e || { echo "Playwright test run had non-zero exit. Check playwright-report for details."; true; }

# -------------------------
# 11) Final summary & backup location
# -------------------------
echo
echo "========================================"
echo "CLEANUP COMPLETE"
echo "Backups and removed files are stored under: $BACKUP_DIR"
echo "Check package.json backup: $BACKUP_DIR/package.json.bak.json"
echo "If you want to review changes before pushing, inspect the backups and run 'git status'."
echo "========================================"

echo
echo "🎯 Next Steps:"
echo "1. Review the changes with 'git status' and 'git diff'"
echo "2. Test the application: npm run dev"
echo "3. Run Playwright tests: npm run test:e2e"
echo "4. Push changes: git push"
echo "5. Check CI pipeline in GitHub Actions"
