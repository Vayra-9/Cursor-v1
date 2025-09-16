# Firebase Admin Setup Script for Windows PowerShell
# This script automates the Firebase admin setup process for TestSprite testing

param(
    [Parameter(Mandatory=$true)]
    [string]$ServiceAccountPath
)

Write-Host "🔥 Firebase Admin Setup for VAYRA TestSprite Testing" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Check if service account file exists
if (-not (Test-Path $ServiceAccountPath)) {
    Write-Host "❌ Error: Service account file not found at: $ServiceAccountPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Steps to get the service account file:" -ForegroundColor Yellow
    Write-Host "1. Go to Firebase Console > Project Settings > Service Accounts"
    Write-Host "2. Click 'Generate New Private Key'"
    Write-Host "3. Save the JSON file and provide its path to this script"
    exit 1
}

# Get absolute path
$ServiceAccountPath = Resolve-Path $ServiceAccountPath
Write-Host "✅ Found service account file: $ServiceAccountPath" -ForegroundColor Green

# Set environment variable
$env:GOOGLE_APPLICATION_CREDENTIALS = $ServiceAccountPath
Write-Host "✅ Set GOOGLE_APPLICATION_CREDENTIALS environment variable" -ForegroundColor Green

# Install dependencies
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm ci

Write-Host ""
Write-Host "🔧 Setting up test user with admin claims..." -ForegroundColor Blue

# Set admin claims
Write-Host "Setting admin claims for test@vayra.digital..."
npm run claims:admin

Write-Host ""
Write-Host "🔍 Verifying claims were set correctly..." -ForegroundColor Blue
npm run claims:verify

Write-Host ""
Write-Host "✅ Firebase Admin Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Open your browser and go to http://localhost:5174"
Write-Host "2. Sign out if you're already logged in as test@vayra.digital"
Write-Host "3. Sign back in with test@vayra.digital / VayraTest@2025"
Write-Host "4. The user should now have admin access to all plans"
Write-Host "5. Run TestSprite tests to verify the fixes"
Write-Host ""
Write-Host "🎯 Expected Improvements:" -ForegroundColor Yellow
Write-Host "- No more Firestore permission-denied errors"
Write-Host "- Access to all plan levels (free, starter, pro, premium)"
Write-Host "- Dashboard loads without upgrade redirects"
Write-Host "- Plan gating tests should pass"
Write-Host ""
Write-Host "For more details, see: docs/FIREBASE_ADMIN_SETUP.md" -ForegroundColor Cyan

# Keep the environment variable set for the current session
Write-Host ""
Write-Host "💡 The environment variable is set for this PowerShell session." -ForegroundColor Cyan
Write-Host "To set it permanently, add it to your system environment variables." -ForegroundColor Cyan
