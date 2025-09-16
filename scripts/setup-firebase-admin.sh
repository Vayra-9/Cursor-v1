#!/bin/bash

# Firebase Admin Setup Script
# This script automates the Firebase admin setup process for TestSprite testing

set -e

echo "🔥 Firebase Admin Setup for VAYRA TestSprite Testing"
echo "=================================================="

# Check if service account file path is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide the path to your Firebase service account JSON file"
    echo ""
    echo "Usage: ./scripts/setup-firebase-admin.sh /path/to/vayra-admin.json"
    echo ""
    echo "Steps to get the service account file:"
    echo "1. Go to Firebase Console > Project Settings > Service Accounts"
    echo "2. Click 'Generate New Private Key'"
    echo "3. Save the JSON file and provide its path to this script"
    exit 1
fi

SERVICE_ACCOUNT_PATH="$1"

# Check if service account file exists
if [ ! -f "$SERVICE_ACCOUNT_PATH" ]; then
    echo "❌ Error: Service account file not found at: $SERVICE_ACCOUNT_PATH"
    exit 1
fi

# Get absolute path
SERVICE_ACCOUNT_PATH=$(realpath "$SERVICE_ACCOUNT_PATH")
echo "✅ Found service account file: $SERVICE_ACCOUNT_PATH"

# Set environment variable
export GOOGLE_APPLICATION_CREDENTIALS="$SERVICE_ACCOUNT_PATH"
echo "✅ Set GOOGLE_APPLICATION_CREDENTIALS environment variable"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm ci

echo ""
echo "🔧 Setting up test user with admin claims..."

# Set admin claims
echo "Setting admin claims for test@vayra.digital..."
npm run claims:admin

echo ""
echo "🔍 Verifying claims were set correctly..."
npm run claims:verify

echo ""
echo "✅ Firebase Admin Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Open your browser and go to http://localhost:5174"
echo "2. Sign out if you're already logged in as test@vayra.digital"
echo "3. Sign back in with test@vayra.digital / VayraTest@2025"
echo "4. The user should now have admin access to all plans"
echo "5. Run TestSprite tests to verify the fixes: npm run test:testsprite"
echo ""
echo "🎯 Expected Improvements:"
echo "- No more Firestore permission-denied errors"
echo "- Access to all plan levels (free, starter, pro, premium)"
echo "- Dashboard loads without upgrade redirects"
echo "- Plan gating tests should pass"
echo ""
echo "For more details, see: docs/FIREBASE_ADMIN_SETUP.md"
