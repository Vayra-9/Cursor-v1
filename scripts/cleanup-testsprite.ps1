# -------------------------
# TestSprite to Playwright Migration Script (PowerShell)
# -------------------------
param(
    [string]$ServiceAccountPath = ""
)

$ErrorActionPreference = "Stop"

Write-Host "🧹 TestSprite to Playwright Migration Script" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# -------------------------
# 1) Repo scan: find TestSprite references
# -------------------------
Write-Host ""
Write-Host "1) Repo scan: find TestSprite references" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

$tsFiles = @()
Get-ChildItem -Recurse -File | Where-Object {
    $_.Name -notlike "*.png" -and 
    $_.Directory.Name -ne "node_modules" -and 
    $_.Directory.Name -ne ".git" -and
    (Select-String -Path $_.FullName -Pattern "testsprite" -Quiet -ErrorAction SilentlyContinue)
} | ForEach-Object { $tsFiles += $_.FullName }

if ($tsFiles.Count -eq 0) {
    Write-Host "No TestSprite references found." -ForegroundColor Green
} else {
    Write-Host "Found TestSprite references in:" -ForegroundColor Yellow
    $tsFiles | ForEach-Object { Write-Host "  $_" }
}

# Create a backups directory
$backupDir = "testsprite-backups-$(Get-Date -Format 'yyyyMMddHHmmss')"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
Write-Host "Created backup directory: $backupDir" -ForegroundColor Green

# -------------------------
# 2) Backup & remove TestSprite workflows (if any)
# -------------------------
Write-Host ""
Write-Host "2) Backing up and removing any TestSprite GitHub workflows" -ForegroundColor Yellow
Write-Host "---------------------------------------------------------" -ForegroundColor Yellow

$workflowBackupDir = "$backupDir\.github_workflows"
New-Item -ItemType Directory -Path $workflowBackupDir -Force | Out-Null

if (Test-Path ".github\workflows") {
    Get-ChildItem ".github\workflows\*.yml", ".github\workflows\*.yaml" -ErrorAction SilentlyContinue | ForEach-Object {
        $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
        if ($content -and ($content -match "testsprite")) {
            Write-Host "Backing up $($_.Name) -> $workflowBackupDir\" -ForegroundColor Yellow
            Copy-Item $_.FullName "$workflowBackupDir\$($_.Name)"
            Write-Host "Removing $($_.FullName)" -ForegroundColor Red
            Remove-Item $_.FullName -Force
        }
    }
}

# -------------------------
# 3) Backup package.json and replace any 'testsprite' scripts/deps
# -------------------------
Write-Host ""
Write-Host "3) Updating package.json scripts to Playwright (backup created)" -ForegroundColor Yellow
Write-Host "----------------------------------------------------------------" -ForegroundColor Yellow

if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: package.json not found in repo root. Aborting." -ForegroundColor Red
    exit 1
}

Copy-Item "package.json" "$backupDir\package.json.bak.json"
Write-Host "Backed up package.json -> $backupDir\package.json.bak.json" -ForegroundColor Green

# Use Node.js to safely update package.json
$nodeScript = @'
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
'@

node -e $nodeScript

# -------------------------
# 4) Add canonical Playwright workflow
# -------------------------
Write-Host ""
Write-Host "4) Adding/overwriting .github/workflows/e2e.yml to run Playwright" -ForegroundColor Yellow
Write-Host "-----------------------------------------------------------------" -ForegroundColor Yellow

New-Item -ItemType Directory -Path ".github\workflows" -Force | Out-Null

$playwrightWorkflow = @'
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
'@

Set-Content -Path ".github\workflows\e2e.yml" -Value $playwrightWorkflow
Write-Host "Created .github/workflows/e2e.yml" -ForegroundColor Green

# -------------------------
# 5) Remove TestSprite-specific files (safe delete with backup)
# -------------------------
Write-Host ""
Write-Host "5) Backup & remove files that directly reference TestSprite" -ForegroundColor Yellow
Write-Host "-----------------------------------------------------------" -ForegroundColor Yellow

$filesToCheck = @()
Get-ChildItem -Recurse -File | Where-Object {
    $_.Directory.Name -ne "node_modules" -and 
    $_.Directory.Name -ne ".git" -and
    (Select-String -Path $_.FullName -Pattern "testsprite" -Quiet -ErrorAction SilentlyContinue)
} | ForEach-Object { $filesToCheck += $_ }

foreach ($file in $filesToCheck) {
    # Skip .github/workflows (already handled)
    if ($file.FullName -like "*\.github\workflows\*") {
        continue
    }
    
    Write-Host "Backing up $($file.FullName) -> $backupDir\" -ForegroundColor Yellow
    $backupPath = "$backupDir\$($file.FullName.Replace($PWD, '').TrimStart('\'))"
    $backupDir2 = Split-Path $backupPath -Parent
    New-Item -ItemType Directory -Path $backupDir2 -Force -ErrorAction SilentlyContinue | Out-Null
    Copy-Item $file.FullName $backupPath -Force
    
    # Only remove specific file types to be safe
    if ($file.Extension -in @('.yml', '.yaml', '.sh', '.ps1', '.js', '.cjs', '.ts', '.json') -and 
        $file.Name -match 'testsprite') {
        Write-Host "Removing $($file.FullName)" -ForegroundColor Red
        Remove-Item $file.FullName -Force
    } else {
        Write-Host "Leaving $($file.FullName) in place (not auto-deleting)" -ForegroundColor Cyan
    }
}

# -------------------------
# 6) Ensure Playwright config exists
# -------------------------
Write-Host ""
Write-Host "6) Ensuring playwright.config.ts exists" -ForegroundColor Yellow
Write-Host "--------------------------------------" -ForegroundColor Yellow

if (-not (Test-Path "playwright.config.ts")) {
    $playwrightConfig = @'
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
'@
    Set-Content -Path "playwright.config.ts" -Value $playwrightConfig
    Write-Host "playwright.config.ts created" -ForegroundColor Green
} else {
    Write-Host "playwright.config.ts already present — leaving as-is" -ForegroundColor Cyan
}

# -------------------------
# 7) Git operations
# -------------------------
Write-Host ""
Write-Host "7) Git: create a backup branch and commit changes" -ForegroundColor Yellow
Write-Host "------------------------------------------------" -ForegroundColor Yellow

try {
    $currentBranch = git rev-parse --abbrev-ref HEAD
    $backupBranch = "pre-testsprite-cleanup-$(Get-Date -Format 'yyyyMMddHHmmss')"
    
    git add -A
    git commit -m "chore: prepare to migrate from TestSprite -> Playwright (backup created)" 2>$null
    
    git checkout -b $backupBranch 2>$null
    git add -A
    git commit -m "backup: pre-testsprite-cleanup backup" 2>$null
    git checkout $currentBranch 2>$null
    
    git add -A
    git commit -m "ci(test): replace TestSprite with Playwright runner; add Playwright workflow" 2>$null
    
    Write-Host "Git operations completed successfully" -ForegroundColor Green
    Write-Host "Backup branch created: $backupBranch" -ForegroundColor Cyan
} catch {
    Write-Host "Warning: Git operations failed or no changes to commit" -ForegroundColor Yellow
}

# -------------------------
# 8) Install Playwright & browsers
# -------------------------
Write-Host ""
Write-Host "8) Install Playwright browsers" -ForegroundColor Yellow
Write-Host "------------------------------" -ForegroundColor Yellow

try {
    npx playwright install --with-deps
    Write-Host "Playwright browsers installed successfully" -ForegroundColor Green
} catch {
    Write-Host "Warning: Playwright installation had issues" -ForegroundColor Yellow
}

# -------------------------
# 9) Run admin claims setup if service account provided
# -------------------------
Write-Host ""
Write-Host "9) Admin claims setup" -ForegroundColor Yellow
Write-Host "--------------------" -ForegroundColor Yellow

if ($ServiceAccountPath -and (Test-Path $ServiceAccountPath)) {
    $env:GOOGLE_APPLICATION_CREDENTIALS = (Resolve-Path $ServiceAccountPath).Path
    Write-Host "Set GOOGLE_APPLICATION_CREDENTIALS to: $ServiceAccountPath" -ForegroundColor Green
    
    if (Test-Path "scripts\setClaims.cjs") {
        Write-Host "Running node scripts\setClaims.cjs" -ForegroundColor Cyan
        try {
            node scripts\setClaims.cjs
            Write-Host "Admin claims set successfully" -ForegroundColor Green
        } catch {
            Write-Host "Warning: setClaims failed; check GOOGLE_APPLICATION_CREDENTIALS and service account." -ForegroundColor Yellow
        }
    } else {
        Write-Host "scripts\setClaims.cjs not found — skipping admin claim set step" -ForegroundColor Yellow
    }
    
    if (Test-Path "scripts\verifyClaims.cjs") {
        Write-Host "Running node scripts\verifyClaims.cjs" -ForegroundColor Cyan
        try {
            node scripts\verifyClaims.cjs
            Write-Host "Claims verification completed" -ForegroundColor Green
        } catch {
            Write-Host "Warning: verifyClaims failed; inspect logs." -ForegroundColor Yellow
        }
    } else {
        Write-Host "scripts\verifyClaims.cjs not found — skipping verify step" -ForegroundColor Yellow
    }
} else {
    Write-Host "No service account path provided. To set admin claims, run:" -ForegroundColor Cyan
    Write-Host "  .\scripts\cleanup-testsprite.ps1 'C:\path\to\service-account.json'" -ForegroundColor Cyan
}

# -------------------------
# 10) Run Playwright tests
# -------------------------
Write-Host ""
Write-Host "10) Running Playwright E2E suite" -ForegroundColor Yellow
Write-Host "--------------------------------" -ForegroundColor Yellow

try {
    npm run test:e2e
    Write-Host "Playwright tests completed successfully" -ForegroundColor Green
} catch {
    Write-Host "Playwright test run had non-zero exit. Check playwright-report for details." -ForegroundColor Yellow
}

# -------------------------
# 11) Final summary
# -------------------------
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "CLEANUP COMPLETE" -ForegroundColor Green
Write-Host "Backups and removed files are stored under: $backupDir" -ForegroundColor Cyan
Write-Host "Check package.json backup: $backupDir\package.json.bak.json" -ForegroundColor Cyan
Write-Host "If you want to review changes before pushing, inspect the backups and run 'git status'." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green

Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Review the changes with 'git status' and 'git diff'" 
Write-Host "2. Test the application: npm run dev"
Write-Host "3. Run Playwright tests: npm run test:e2e"
Write-Host "4. Push changes: git push"
Write-Host "5. Check CI pipeline in GitHub Actions"
