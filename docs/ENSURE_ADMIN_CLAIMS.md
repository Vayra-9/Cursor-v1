# 🔐 Ensure Admin Claims Guide

This guide explains how to grant production admin permissions to specific users and verify those permissions using automated scripts and Playwright tests.

## 📋 Overview

The admin claims system provides three main scripts:
- **`setClaims.cjs`** - Sets admin claims for specified users (one-time operation)
- **`verifyClaims.cjs`** - Checks current claims for specified users
- **`ensureClaims.cjs`** - Polls until all users have admin claims (loops until success)

## 🚀 Quick Start

### Prerequisites

1. **Firebase Service Account JSON**
   - Download from Firebase Console > Project Settings > Service Accounts
   - Generate new private key and save as `vayra-admin.json` (or similar)

2. **Environment Setup**
   ```powershell
   # Windows PowerShell
   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\vayra-admin.json"
   
   # Linux/Mac Bash
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/vayra-admin.json"
   ```

3. **Install Dependencies**
   ```bash
   npm ci
   ```

## 🔧 Script Usage

### Set Claims (One-time)
```bash
# Set admin claims for single user
node scripts/setClaims.cjs "test@vayra.digital"

# Set admin claims for multiple users
node scripts/setClaims.cjs "test@vayra.digital,admin@vayra.digital"

# Using npm script
npm run claims:admin "test@vayra.digital,admin@vayra.digital"
```

### Verify Claims
```bash
# Check claims for users
node scripts/verifyClaims.cjs "test@vayra.digital,admin@vayra.digital"

# Using npm script
npm run claims:verify "test@vayra.digital,admin@vayra.digital"
```

**Example Output:**
```
test@vayra.digital::{"role":"admin","plans":["free","starter","pro","premium"],"full_access":true}
admin@vayra.digital::{"role":"admin","plans":["free","starter","pro","premium"],"full_access":true}
```

### Ensure Claims (Polling Loop)
```bash
# Poll until all users have admin claims
node scripts/ensureClaims.cjs "test@vayra.digital,admin@vayra.digital"

# Using npm script
npm run claims:ensure "test@vayra.digital,admin@vayra.digital"
```

**This script will:**
1. Attempt to set claims once (best-effort)
2. Poll every 5 seconds until all users show `full_access: true` or `role: "admin"`
3. Exit with success code when all users are verified
4. Continue indefinitely until success (use Ctrl+C to abort)

## ⚠️ Important Notes

### Stopping the Polling Loop
- **Manual Stop:** Press `Ctrl+C` to abort the polling loop
- **Timeout:** Modify `MAX_DURATION_MS` in `scripts/ensureClaims.cjs` to set a hard timeout
  ```javascript
  const MAX_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours (set to 0 for no timeout)
  ```

### User Token Refresh Required
After setting claims, users must **sign out and sign back in** to refresh their Firebase ID tokens and pick up the new claims.

### Firestore Security Rules
Ensure your Firestore rules allow admin users to access all collections:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} { 
      allow read, write: if request.auth != null && request.auth.uid == uid; 
    }
    match /{document=**} {
      allow read, write: if request.auth != null && 
        (request.auth.token.role == "admin" || request.auth.token.full_access == true);
    }
  }
}
```

## 🧪 Playwright Testing

### Install Playwright
```bash
# Install Playwright browsers (if not already installed)
npx playwright install --with-deps
```

### Run Admin Claims Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run specific admin claims tests
npx playwright test tests/e2e/verify-admin-claims.spec.ts
npx playwright test tests/e2e/admin-panel-assert.spec.ts

# View test results
npm run test:e2e:report
# or open playwright-report/index.html
```

### Test Descriptions

1. **`verify-admin-claims.spec.ts`**
   - Polls `verifyClaims.cjs` until all users have admin claims
   - Useful for automated verification in CI/CD
   - ⚠️ **Warning:** Will loop indefinitely until claims are verified

2. **`admin-panel-assert.spec.ts`**
   - Tests that the admin panel displays claims JSON
   - Verifies UI shows admin status correctly
   - Uses dev override (`vayra-god`) for local testing

## 📊 Workflow Examples

### Production Deployment Workflow
```bash
# 1. Set environment
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/prod-service-account.json"

# 2. Ensure admin claims for production users
npm run claims:ensure "test@vayra.digital,admin@vayra.digital"

# 3. Notify users to refresh tokens (sign out/in)
echo "Users must sign out and back in to refresh tokens"

# 4. Run Playwright verification tests
npm run test:e2e
```

### Development Testing Workflow
```bash
# 1. Set environment for development
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/dev-service-account.json"

# 2. Quick claims check
npm run claims:verify "test@vayra.digital"

# 3. Set claims if needed
npm run claims:admin "test@vayra.digital"

# 4. Test locally with dev override
npm run test:e2e
```

## 🔍 Troubleshooting

### Claims Not Taking Effect
1. **Check token refresh:** Users must sign out/in after claims are set
2. **Verify environment:** Ensure `GOOGLE_APPLICATION_CREDENTIALS` points to correct service account
3. **Check Firebase project:** Confirm you're connected to the right Firebase project
4. **Browser cache:** Clear browser cache and localStorage

### Script Errors
```bash
# Permission denied
❌ Error setting claims for test@vayra.digital: Permission denied
# Solution: Check service account has "Firebase Admin SDK Admin Service Agent" role

# User not found
❌ Error setting claims for test@vayra.digital: There is no user record
# Solution: User must sign up first or check email spelling

# Invalid service account
❌ Error: Could not load the default credentials
# Solution: Check GOOGLE_APPLICATION_CREDENTIALS path and file permissions
```

### Test Failures
```bash
# Polling test timeout
# Solution: Increase timeout or check if claims are actually being set

# Admin panel not found
# Solution: Ensure /admin route exists and user has proper claims

# Network errors in tests
# Solution: Check if dev server is running on port 5174
```

## 🔒 Security Considerations

### Service Account Security
- **Never commit** service account JSON files to version control
- **Rotate keys** periodically in Firebase Console
- **Limit permissions** - only grant necessary Firebase roles
- **Audit access** - monitor who has access to service accounts

### Cloud Function Alternative
For enhanced security, consider deploying the Cloud Function:
```typescript
// See functions/setClaimsForUsers.ts
// Deploy with: firebase deploy --only functions:setClaimsForUsers
```

Benefits:
- **Auditable** - logs all claims operations to Firestore
- **Secure** - no service account JSON files needed locally
- **Controlled access** - only authorized UIDs can call the function

## 📋 Script Reference

### Claims Structure
All admin users receive these claims:
```json
{
  "role": "admin",
  "plans": ["free", "starter", "pro", "premium"],
  "full_access": true
}
```

### Environment Variables
- `GOOGLE_APPLICATION_CREDENTIALS` - Path to Firebase service account JSON
- `MAX_DURATION_MS` - Maximum polling duration (modify in `ensureClaims.cjs`)
- `POLL_INTERVAL_MS` - Polling interval in milliseconds (default: 5000ms)

### Exit Codes
- `0` - Success
- `1` - Usage error or script failure
- `2` - Timeout exceeded (ensureClaims only)

---

*This system ensures reliable admin permission management with automated verification and comprehensive testing.*
