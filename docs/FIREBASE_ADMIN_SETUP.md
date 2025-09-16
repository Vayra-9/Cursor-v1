# Firebase Admin Setup Guide

This guide explains how to set up Firebase Admin SDK for managing user claims and resolving permission issues identified in TestSprite reports.

## 🔧 Prerequisites

1. **Firebase Project Access** - You need admin access to the `vayra-prod` Firebase project
2. **Service Account JSON** - Download the service account key from Firebase Console
3. **Node.js Environment** - Ensure Node.js is installed for running admin scripts

## 📋 Step-by-Step Setup

### 1. Download Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`vayra-prod`)
3. Go to **Project Settings** > **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file as `vayra-admin.json` (or similar name)
6. **IMPORTANT:** Never commit this file to version control!

### 2. Set Environment Variable

```bash
# Option A: Export for current session (Windows PowerShell)
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\absolute\path\to\vayra-admin.json"

# Option B: Export for current session (Windows CMD)
set GOOGLE_APPLICATION_CREDENTIALS=C:\absolute\path\to\vayra-admin.json

# Option C: Export for current session (macOS/Linux)
export GOOGLE_APPLICATION_CREDENTIALS="/absolute/path/to/vayra-admin.json"

# Option D: Create a .env.local file (recommended for development)
echo 'GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/vayra-admin.json' >> .env.local
```

### 3. Install Dependencies

```bash
npm ci
```

### 4. Set Admin Claims for Test User

```bash
# Set test@vayra.digital as admin with full access to all plans
npm run claims:admin
```

Expected output:
```
✅ test@vayra.digital is now admin with full access { role: 'admin', plans: ['free', 'starter', 'pro', 'premium'], full_access: true }
```

### 5. Verify Claims Were Set

```bash
npm run claims:verify
```

Expected output:
```
✅ Claims for test@vayra.digital: { role: 'admin', plans: ['free', 'starter', 'pro', 'premium'], full_access: true }
```

### 6. Force Token Refresh in Browser

The user needs to sign out and sign back in to pick up the new claims:

1. Open your browser where `test@vayra.digital` is signed in
2. Sign out of the application
3. Sign back in with `test@vayra.digital` / `VayraTest@2025`
4. The user should now have admin privileges and access to all plans

## 🛠️ Troubleshooting

### Common Issues

#### 1. "User not found" Error
```bash
❌ Error setting claims: FirebaseAuthError: There is no user record corresponding to the provided identifier (auth/user-not-found).
```

**Solution:** The user `test@vayra.digital` doesn't exist yet. Create the account first:
1. Go to your app at `http://localhost:5174/auth/sign-up`
2. Sign up with `test@vayra.digital` / `VayraTest@2025`
3. Then run the claims script again

#### 2. "Permission Denied" Error
```bash
❌ Error setting claims: FirebaseAuthError: Permission denied.
```

**Solutions:**
- Ensure the service account JSON file path is correct
- Verify the service account has "Firebase Admin SDK Admin Service Agent" role
- Check that the `GOOGLE_APPLICATION_CREDENTIALS` environment variable is set

#### 3. "File Not Found" Error
```bash
❌ Error setting claims: Error: ENOENT: no such file or directory
```

**Solution:** Use the absolute path to your service account JSON file, not a relative path.

### 4. Claims Not Taking Effect

If claims are set but the user still doesn't have access:

1. **Force token refresh** - Sign out and back in
2. **Check browser console** for token refresh errors
3. **Verify claims in Firebase Console** - Go to Authentication > Users > Select user > Custom Claims

## 📝 Available Scripts

- `npm run claims:admin` - Set admin claims for test user
- `npm run claims:verify` - Verify current claims for test user

## 🔒 Security Notes

1. **Never commit service account keys** - Add `*-admin.json` to `.gitignore`
2. **Use environment variables** - Don't hardcode paths in scripts
3. **Rotate keys periodically** - Generate new service account keys regularly
4. **Limit permissions** - Only grant necessary Firebase roles to service accounts

## 🎯 Expected Behavior After Setup

Once admin claims are set and the user signs back in:

1. ✅ No more "permission-denied" errors in console
2. ✅ User can access all plan levels (free, starter, pro, premium)
3. ✅ Dashboard loads without redirecting to upgrade page
4. ✅ All Firestore operations work correctly
5. ✅ TestSprite tests should show improved pass rates

## 🔄 Testing the Fix

After completing the setup, re-run TestSprite to verify the improvements:

```bash
# Run TestSprite tests to verify fixes
npm run test:testsprite
```

Expected improvements:
- Plan gating tests should pass
- Firestore permission errors should be resolved
- Navigation from dashboard should work correctly
- Subscription upgrade flow should be accessible

---

*This setup resolves the critical Firebase permission issues identified in TestSprite reports and enables proper testing of plan-gated features.*
