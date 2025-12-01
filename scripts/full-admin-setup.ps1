# -------------------------------
# CURSOR PROMPT: Full Admin Setup + CI Playwright Migration + Admin Panel
# PowerShell version for Windows
# -------------------------------

param(
    [Parameter(Mandatory=$true)]
    [string]$ServiceAccountPath
)

$ErrorActionPreference = "Stop"

# 0) sanity
Write-Host "Starting: Admin claims + Playwright CI migration + Admin Panel creation" -ForegroundColor Cyan
Write-Host "Using service account: $ServiceAccountPath" -ForegroundColor Cyan

# Check if service account file exists
if (-not (Test-Path $ServiceAccountPath)) {
    Write-Host "❌ Error: Service account file not found at: $ServiceAccountPath" -ForegroundColor Red
    exit 1
}

# 1) set env var for Firebase Admin SDK (current shell)
$env:GOOGLE_APPLICATION_CREDENTIALS = (Resolve-Path $ServiceAccountPath).Path
Write-Host "✅ Set GOOGLE_APPLICATION_CREDENTIALS" -ForegroundColor Green

# 2) ensure deps
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm ci

# 3) Install Playwright and browsers
Write-Host "🎭 Installing Playwright..." -ForegroundColor Blue
npx playwright install --with-deps

# 4) Run admin claims setter
Write-Host "🔧 Running: npm run claims:admin" -ForegroundColor Blue
npm run claims:admin
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to set claims. Check GOOGLE_APPLICATION_CREDENTIALS and scripts/setClaims.cjs logs." -ForegroundColor Red
    exit 1
}

# 5) Verify claims
Write-Host "🔍 Running: npm run claims:verify" -ForegroundColor Blue
npm run claims:verify
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ claims verify failed" -ForegroundColor Red
    exit 1
}

# 6) Build the application
Write-Host "🏗️ Building application..." -ForegroundColor Blue
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Build step failed, continuing..." -ForegroundColor Yellow
}

# 7) Run Playwright tests
Write-Host "🧪 Running Playwright tests (test:e2e)..." -ForegroundColor Blue
npm run test:e2e
$TestExitCode = $LASTEXITCODE

# 8) Open report if present
if (Test-Path "playwright-report") {
    Write-Host "📊 Report available at playwright-report/index.html" -ForegroundColor Green
    Write-Host "🌐 Opening report in browser..." -ForegroundColor Green
    Start-Process "playwright-report/index.html"
} else {
    Write-Host "⚠️ No playwright-report found — check test run output" -ForegroundColor Yellow
}

# 9) Final instructions
Write-Host ""
Write-Host "🎉 SETUP COMPLETE!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. 🌐 Open http://localhost:5174/admin in your browser"
Write-Host "2. 🔐 Sign in as test@vayra.digital / VayraTest@2025"
Write-Host "3. 🔄 If already signed in, sign out and sign back in to refresh claims"
Write-Host "4. ✅ Admin Panel should show claims JSON with role: 'admin'"
Write-Host "5. 🚀 You now have full access to all plan levels"
Write-Host ""
Write-Host "🧪 Test Results:" -ForegroundColor Yellow
if ($TestExitCode -eq 0) {
    Write-Host "✅ Playwright tests passed" -ForegroundColor Green
} else {
    Write-Host "⚠️ Some Playwright tests failed (exit code: $TestExitCode)" -ForegroundColor Yellow
}
Write-Host ""
Write-Host "🔗 Useful Commands:" -ForegroundColor Yellow
Write-Host "  npm run test:e2e          # Run all Playwright tests"
Write-Host "  npm run test:e2e:ui       # Run tests with UI mode"
Write-Host "  npm run test:e2e:report   # View test report"
Write-Host "  npm run claims:verify     # Check current user claims"
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "  docs/FIREBASE_ADMIN_SETUP.md - Detailed setup guide"
Write-Host "  tests/e2e/admin-panel.spec.ts - Admin panel tests"
Write-Host ""
Write-Host "💡 The environment variable is set for this PowerShell session." -ForegroundColor Cyan
Write-Host "To set it permanently, add it to your system environment variables." -ForegroundColor Cyan
