# Firebase Admin Setup Guide

**Make `testuser@vayra.digital` a Firebase Admin with Full Access**

## 🚀 Quick Setup

### **Step 1: Get Firebase Service Account Key**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your VAYRA project
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file (e.g., `vayra-service-account.json`)
6. **IMPORTANT:** Keep this file secure and never commit it to Git

### **Step 2: Set Environment Variable**

```bash
# Windows PowerShell
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\vayra-service-account.json"

# Windows Command Prompt
set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\vayra-service-account.json

# Linux/Mac
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/vayra-service-account.json"
```

### **Step 3: Run Admin Script**

```bash
# Set claims for testuser@vayra.digital
npm run claims:admin
```

**Expected Output:**
```
✅ testuser@vayra.digital is now admin with full access {
  role: 'admin',
  plans: ['free', 'starter', 'pro', 'premium'],
  full_access: true
}
```

### **Step 4: Verify Claims**

```bash
# Verify the claims were set correctly
npm run claims:verify
```

**Expected Output:**
```
✅ Found user: testuser@vayra.digital (UID: abc123...)
📋 Current custom claims: {
  role: 'admin',
  plans: ['free', 'starter', 'pro', 'premium'],
  full_access: true
}
🎉 User is admin with full access!
📚 Available plans: free, starter, pro, premium
✅ All expected plans are available
```

## 🔐 What This Gives You

### **Admin User (`testuser@vayra.digital`)**
- **Role:** `admin`
- **Access:** Full access to all features
- **Plans:** `free`, `starter`, `pro`, `premium`
- **Bypass:** Can access any gated content

### **Client-Side Behavior**
```tsx
import { usePlanAccess } from '@/hooks/usePlanAccess';

export function MyComponent() {
  const { isAdmin, hasPlan, canUse } = usePlanAccess();
  
  // This user will have:
  console.log(isAdmin);        // true
  console.log(hasPlan('pro')); // true
  console.log(canUse(['pro', 'premium'])); // true
  
  return <div>Admin sees everything!</div>;
}
```

### **Server-Side Access**
- **Firestore Rules:** Can read/write to any collection
- **Admin Collections:** Full access to `/admin/*`
- **Pro Collections:** Full access to `/pro_data/*`

## 🧪 Testing the Setup

### **1. Test Dev Override (No Login Required)**
```bash
# Visit with god mode
http://localhost:5174/dashboard?god=1

# Or set in browser console
localStorage.setItem('vayra-god', '1');
location.reload();
```

### **2. Test Real Claims (After Login)**
1. **Sign in** with `testuser@vayra.digital` via Google OAuth
2. **Check claims** in browser console:
```javascript
// In browser console after login
import { getClaims } from '@/lib/auth/claims';
console.log('Current claims:', getClaims());
```

3. **Verify access** to Pro features on dashboard

### **3. Run E2E Tests**
```bash
# Test claims-driven gates
npm run test:e2e tests/e2e/auth-plan-claims.spec.ts

# Test post-login health
npm run test:e2e tests/e2e/post-login-health.spec.ts
```

## 🚨 Troubleshooting

### **"User not found" Error**
```bash
❌ Error setting claims: FirebaseAuthError: No user record found for the given email.
```
**Solution:** Make sure `testuser@vayra.digital` has signed up via Google OAuth first.

### **"Permission denied" Error**
```bash
❌ Error setting claims: FirebaseAuthError: Permission denied.
```
**Solution:** 
1. Verify service account has "Firebase Admin" role
2. Check `GOOGLE_APPLICATION_CREDENTIALS` path is correct
3. Ensure service account JSON is valid

### **Claims not updating in client**
**Solution:**
1. **Sign out and back in** with `testuser@vayra.digital`
2. **Force token refresh:**
```javascript
import { getAuth } from 'firebase/auth';
const auth = getAuth();
if (auth.currentUser) {
  await auth.currentUser.getIdToken(true);
}
```

### **Dev override not working**
**Solution:**
1. Clear localStorage: `localStorage.removeItem('vayra-god')`
2. Hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`
3. Check URL parameter: `?god=1`

## 📋 Verification Checklist

- [ ] Service account JSON downloaded
- [ ] `GOOGLE_APPLICATION_CREDENTIALS` environment variable set
- [ ] `npm run claims:admin` executed successfully
- [ ] `npm run claims:verify` shows admin status
- [ ] User signed in with `testuser@vayra.digital`
- [ ] Claims visible in client (`usePlanAccess` hook)
- [ ] Pro features accessible on dashboard
- [ ] E2E tests passing

## 🔄 Updating Claims Later

### **Change Plans**
```bash
# Update to different plans
npm run claims:admin testuser@vayra.digital user pro,premium
```

### **Remove Admin**
```bash
# Remove admin privileges
npm run claims:admin testuser@vayra.digital user pro
```

### **Add New Admin**
```bash
# Make another user admin
npm run claims:admin another@vayra.digital admin free,starter,pro,premium
```

## 🎯 Next Steps

1. **Deploy Firestore rules** to production
2. **Test with real users** and different plans
3. **Monitor access patterns** in Firebase Console
4. **Set up Stripe integration** for plan upgrades
5. **Create admin dashboard** for managing claims

---

**Need Help?** Run `npm run claims:verify` to check current status!
