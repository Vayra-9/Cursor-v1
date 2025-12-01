# Admin Access Debug & Fix Report

## Issue Identified
The `AuthProvider` was calling `createUserDocument()` on every auth state change, which would return the existing document BUT the logic flow wasn't optimal for preserving admin settings.

## Root Cause
In `components/auth/auth-provider.tsx`, the auth state handler was:
1. Calling `createUserDocument()` every time
2. This function checks if user exists, but the flow could potentially miss updates

## Fix Applied
Updated `AuthProvider` to:
1. **First** call `getUserProfile()` to fetch existing data
2. **Only** call `createUserDocument()` if profile doesn't exist
3. This ensures admin settings are always loaded correctly

## Code Changes

### Before:
```typescript
const profile = await createUserDocument(firebaseUser);
setUserProfile(profile || null);
```

### After:
```typescript
let profile = await getUserProfile(firebaseUser.uid);

// Only create if doesn't exist
if (!profile) {
    profile = await createUserDocument(firebaseUser);
}

setUserProfile(profile || null);
```

## Verification Steps

1. **Restart Dev Server** (already done)
2. **Clear Browser Cache**:
   - Press F12
   - Right-click refresh button → "Empty Cache and Hard Reload"
3. **Sign Out Completely**
4. **Sign Back In** with hello@vayra.digital
5. **Check Console** for user profile data
6. **Navigate to Dashboard** - all features should be unlocked

## Expected User Profile
```json
{
  "uid": "rZ6GEPgRXeNbQxj2OresnJlAuw33",
  "email": "hello@vayra.digital",
  "plan": "premium",
  "grandfathered": true,
  "role": "admin",
  "planVersion": "v1_early"
}
```

## If Still Locked

Run this command to verify Firestore data:
```powershell
# Check what's actually in Firestore
# Go to Firebase Console → Firestore → users → rZ6GEPgRXeNbQxj2OresnJlAuw33
```

If the document doesn't have `plan: "premium"`, run the admin setup again:
```powershell
$body = @{
    email = "hello@vayra.digital"
    uid = "rZ6GEPgRXeNbQxj2OresnJlAuw33"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/admin/setup-user" -Method POST -Body $body -ContentType "application/json"
```
