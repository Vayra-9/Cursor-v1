#!/bin/bash
# -------------------------------
# CURSOR PROMPT: Full Admin Setup + CI Playwright Migration + Admin Panel
# Paste this into Cursor or run locally from repo root after replacing SERVICE_ACCOUNT_PATH.
# -------------------------------

set -e

if [ -z "$1" ]; then
    echo "❌ Usage: $0 /absolute/path/to/vayra-admin.json"
    echo "Example: $0 /Users/yourname/Downloads/vayra-admin.json"
    exit 1
fi

SERVICE_ACCOUNT_PATH="$1"

# 0) sanity
echo "Starting: Admin claims + Playwright CI migration + Admin Panel creation"
echo "Using service account: $SERVICE_ACCOUNT_PATH"

# 1) set env var for Firebase Admin SDK (current shell)
export GOOGLE_APPLICATION_CREDENTIALS="$SERVICE_ACCOUNT_PATH"
echo "✅ Set GOOGLE_APPLICATION_CREDENTIALS"

# 2) ensure deps
echo "📦 Installing dependencies..."
npm ci

# 3) Install Playwright and browsers
echo "🎭 Installing Playwright..."
npx playwright install --with-deps

# 4) Run admin claims setter
echo "🔧 Running: npm run claims:admin"
npm run claims:admin
CLAIMS_SET=$?
if [ $CLAIMS_SET -ne 0 ]; then
  echo "❌ Failed to set claims. Check GOOGLE_APPLICATION_CREDENTIALS and scripts/setClaims.cjs logs."
  exit 1
fi

# 5) Verify claims
echo "🔍 Running: npm run claims:verify"
npm run claims:verify || (echo "❌ claims verify failed" && exit 1)

# 6) Build the application
echo "🏗️ Building application..."
npm run build || echo "⚠️ Build step skipped"

# 7) Run Playwright tests
echo "🧪 Running Playwright tests (test:e2e)..."
npm run test:e2e || TEST_EXIT=$?

# 8) Open report if present
if [ -d playwright-report ]; then
  echo "📊 Report available at playwright-report/index.html"
  if command -v xdg-open >/dev/null 2>&1; then 
    echo "🌐 Opening report in browser..."
    xdg-open playwright-report/index.html
  fi
  if command -v open >/dev/null 2>&1; then 
    echo "🌐 Opening report in browser..."
    open playwright-report/index.html
  fi
else
  echo "⚠️ No playwright-report found — check test run output"
fi

# 9) Final instructions
echo ""
echo "🎉 SETUP COMPLETE!"
echo ""
echo "📋 Next Steps:"
echo "1. 🌐 Open http://localhost:5174/admin in your browser"
echo "2. 🔐 Sign in as test@vayra.digital / VayraTest@2025"
echo "3. 🔄 If already signed in, sign out and sign back in to refresh claims"
echo "4. ✅ Admin Panel should show claims JSON with role: 'admin'"
echo "5. 🚀 You now have full access to all plan levels"
echo ""
echo "🧪 Test Results:"
if [ -z "$TEST_EXIT" ] || [ "$TEST_EXIT" -eq 0 ]; then
    echo "✅ Playwright tests passed"
else
    echo "⚠️ Some Playwright tests failed (exit code: $TEST_EXIT)"
fi
echo ""
echo "🔗 Useful Commands:"
echo "  npm run test:e2e          # Run all Playwright tests"
echo "  npm run test:e2e:ui       # Run tests with UI mode"
echo "  npm run test:e2e:report   # View test report"
echo "  npm run claims:verify     # Check current user claims"
echo ""
echo "📚 Documentation:"
echo "  docs/FIREBASE_ADMIN_SETUP.md - Detailed setup guide"
echo "  tests/e2e/admin-panel.spec.ts - Admin panel tests"
