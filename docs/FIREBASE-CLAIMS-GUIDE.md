# Firebase Custom Claims - Role/Plan Permissions Guide

**VAYRA SaaS Platform** - Advanced Access Control with Firebase Custom Claims

## 🚀 Quick Start

### 1. Grant Admin Access to a User

```bash
# Set environment variable to your service account key
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your-service-account.json"

# Grant admin access with all plans
npm run claims:admin hello@yourdomain.com admin pro,starter,premium
```

### 2. Dev "God Mode" (No Firebase Required)

**Option A: URL Parameter**
```
http://localhost:5174/dashboard?god=1
```

**Option B: Browser Console**
```javascript
localStorage.setItem('vayra-god', '1');
location.reload();
```

## 🔧 Architecture Overview

### **Client-Side Claims Management**
- **File:** `src/lib/auth/claims.ts`
- **Hook:** `src/hooks/usePlanAccess.ts`
- **Auto-initialized:** In `AuthContext` on app startup

### **Server-Side Security**
- **File:** `firestore.rules`
- **Enforcement:** Role-based access control for collections
- **Bypass:** Admin users have full access

### **Admin Scripts**
- **File:** `scripts/setClaims.ts`
- **Usage:** Set custom claims for any user
- **Dependencies:** Firebase Admin SDK + service account

## 📋 Available Claims

### **User Roles**
```typescript
type UserClaims = {
  role?: 'admin' | 'user';           // User role
  plans?: string[];                   // Available plans
  full_access?: boolean;              // Admin bypass flag
}
```

### **Plan Tiers**
- `free` - Basic access
- `starter` - Core features
- `pro` - Advanced features
- `premium` - Enterprise features

## 🎯 Usage Examples

### **Component Gating**
```tsx
import { usePlanAccess } from '@/hooks/usePlanAccess';

export function ProFeature() {
  const { isAdmin, hasPlan, canUse } = usePlanAccess();
  
  if (!isAdmin && !hasPlan('pro')) {
    return <div data-testid="gate-pro">Upgrade to Pro</div>;
  }
  
  return <div data-testid="pro-feature">/* Pro content */</div>;
}
```

### **Multiple Plan Requirements**
```tsx
const { canUse } = usePlanAccess();

// Require both pro AND premium
if (!canUse(['pro', 'premium'])) {
  return <div>Upgrade to Premium Pro</div>;
}
```

### **Admin Bypass**
```tsx
const { isAdmin } = usePlanAccess();

// Admins can access everything
if (isAdmin) {
  return <AdminPanel />;
}
```

## 🔒 Firestore Security Rules

### **Pro-Only Collections**
```javascript
match /pro_data/{docId} {
  allow read, write: if isPro();
}
```

### **Admin-Only Collections**
```javascript
match /admin/{docId} {
  allow read, write: if isAdmin();
}
```

### **Helper Functions**
```javascript
function isAdmin() {
  return request.auth != null &&
         (request.auth.token.role == 'admin' ||
          request.auth.token.full_access == true);
}

function isPro() {
  return isAdmin() ||
         (request.auth != null &&
          request.auth.token.plans is list &&
          request.auth.token.plans.hasAny(['pro','premium']));
}
```

## 🧪 Testing

### **Run Claims Tests**
```bash
# Run all E2E tests
npm run test:e2e

# Run specific claims tests
npm run test:e2e tests/e2e/auth-plan-claims.spec.ts

# Run post-login health check
npm run test:e2e tests/e2e/post-login-health.spec.ts
```

### **Test Dev Override**
```bash
# Test URL god mode
curl "http://localhost:5174/dashboard?god=1"

# Test localStorage god mode in browser
localStorage.setItem('vayra-god', '1');
location.reload();
```

## 🚨 Troubleshooting

### **Claims Not Updating**
1. **Sign out and back in** - Claims refresh on new token
2. **Force token refresh** - `getIdToken(true)` 
3. **Check service account** - Verify `GOOGLE_APPLICATION_CREDENTIALS`
4. **Deploy rules** - `firebase deploy --only firestore:rules`

### **Dev Override Not Working**
1. **Clear localStorage** - `localStorage.removeItem('vayra-god')`
2. **Check URL params** - Ensure `?god=1` is present
3. **Hard refresh** - `Ctrl+Shift+R` or `Cmd+Shift+R`

### **Firestore Access Denied**
1. **Verify claims** - Check user's custom claims
2. **Check rules** - Ensure rules match your claims structure
3. **Test locally** - Use Firebase Emulator for development

## 📚 API Reference

### **usePlanAccess Hook**
```typescript
const {
  claims,        // Current user claims
  isAdmin,       // Admin bypass flag
  hasPlan,       // Check single plan
  canUse         // Check multiple plans
} = usePlanAccess();
```

### **Claims Management**
```typescript
import { getClaims, onClaims, initClaimsWatcher } from '@/lib/auth/claims';

// Get current claims
const current = getClaims();

// Listen for changes
onClaims((claims) => console.log('Claims updated:', claims));

// Initialize watcher (auto-called in AuthContext)
initClaimsWatcher();
```

## 🔐 Security Best Practices

### **Client-Side**
- ✅ Claims are read-only (cannot be modified)
- ✅ Dev override only works in development
- ✅ All gates have fallback UI

### **Server-Side**
- ✅ Firestore rules enforce access
- ✅ Admin claims cannot be forged
- ✅ Claims verified on every request

### **Development**
- ✅ God mode only works locally
- ✅ Service account keys never committed
- ✅ Claims testing without live Firebase

## 🎉 Success Criteria

- ✅ **Admin users** can access all features
- ✅ **Plan users** see only their tier features
- ✅ **Free users** see upgrade gates
- ✅ **Dev override** works for testing
- ✅ **Firestore rules** enforce access
- ✅ **Claims auto-refresh** on auth changes
- ✅ **E2E tests** verify all scenarios

## 🚀 Next Steps

1. **Deploy Firestore rules** to production
2. **Set up service account** for admin operations
3. **Grant admin access** to your account
4. **Test with real users** and different plans
5. **Monitor access patterns** in Firebase Console

---

**Need Help?** Check the test files for examples or run `npm run test:e2e` to verify everything works!
