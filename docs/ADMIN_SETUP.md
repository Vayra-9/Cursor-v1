# Admin User Setup Guide

## Quick Setup: Create Admin Account

### Step 1: Sign Up Normally
1. Go to https://cursor-v1.vercel.app/signup
2. Sign up with Google or Email/Password
3. Note your email address

### Step 2: Get Your User ID (UID)
After signing up, you can find your UID in one of these ways:

**Option A: From Firebase Console**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select `vayra-prod` project
3. Go to Authentication → Users
4. Find your email and copy the User UID

**Option B: From Browser Console**
1. Sign in to https://cursor-v1.vercel.app/
2. Open browser DevTools (F12)
3. Go to Console tab
4. Type: `localStorage.getItem('firebase:authUser')`
5. Find the `uid` field in the output

### Step 3: Call Admin Setup API

**Using curl (PowerShell):**
```powershell
$body = @{
    email = "your-email@example.com"
    uid = "your-uid-from-step-2"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/admin/setup-user" -Method POST -Body $body -ContentType "application/json"
```

**Using curl (Command Line):**
```bash
curl -X POST http://localhost:3000/api/admin/setup-user \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","uid":"your-uid-here"}'
```

**Using Postman or Insomnia:**
- Method: POST
- URL: `http://localhost:3000/api/admin/setup-user`
- Headers: `Content-Type: application/json`
- Body (JSON):
```json
{
  "email": "your-email@example.com",
  "uid": "your-uid-here"
}
```

### Step 4: Verify Admin Access
1. Sign out and sign back in
2. Navigate to `/dashboard`
3. You should now have access to all premium features:
   - ✅ Budget Planner
   - ✅ Income Tracker
   - ✅ Analytics Charts
   - ✅ PDF Export
   - ✅ All Pro/Premium features

---

## Production Deployment

### For Vercel Production:
```bash
curl -X POST https://cursor-v1.vercel.app/api/admin/setup-user \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","uid":"your-uid-here"}'
```

---

## Security Notes

⚠️ **IMPORTANT:** This endpoint should be protected in production!

### Option 1: Add API Key Protection
Add this to the route handler:
```typescript
const apiKey = request.headers.get('x-api-key');
if (apiKey !== process.env.ADMIN_API_KEY) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### Option 2: Remove After Setup
Once you've created your admin account, delete the endpoint:
```bash
rm app/api/admin/setup-user/route.ts
```

### Option 3: IP Whitelist (Vercel)
In Vercel dashboard, add firewall rules to restrict access to this endpoint.

---

## Troubleshooting

### Error: "User not found"
- Make sure you've signed up first at `/signup`
- Verify the email/UID is correct

### Error: "Failed to setup admin user"
- Check that Firebase Admin SDK is configured correctly
- Verify `.env.local` has `FIREBASE_PRIVATE_KEY` and `FIREBASE_CLIENT_EMAIL`

### Changes not reflecting
- Sign out completely
- Clear browser cache
- Sign back in
- Check Firestore Console → `users` collection → your UID document
