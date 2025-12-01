# Connecting VAYRA Next.js to Existing Firebase Project (vayra-prod)

This guide provides step-by-step instructions for connecting your existing Firebase project `vayra-prod` to the VAYRA Next.js codebase.

---

## Step 1: Retrieve Web App SDK Configuration

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select the **vayra-prod** project
3. Click the **gear icon** (⚙️) next to "Project Overview" → **Project settings**
4. Scroll down to **"Your apps"** section
5. If you already have a web app registered:
   - Click on the existing web app
   - Copy the `firebaseConfig` object
6. If you don't have a web app yet:
   - Click **"Add app"** → Select **Web** (`</>` icon)
   - Register app nickname: `VAYRA Web App`
   - **Do NOT** check "Also set up Firebase Hosting"
   - Click **"Register app"**
   - Copy the `firebaseConfig` object shown

**Example config you'll see:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "vayra-prod.firebaseapp.com",
  projectId: "vayra-prod",
  storageBucket: "vayra-prod.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

---

## Step 2: Update `.env.local` with Web App Config

1. In your project root (`c:\Users\PC\Vayra-a1\Cursor-v1`), create or edit `.env.local`
2. Add the following values from the config you copied:

```bash
# Firebase Client Configuration (from firebaseConfig)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=vayra-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=vayra-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=vayra-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# PWA Configuration
NEXT_PUBLIC_ENABLE_PWA=true
```

---

## Step 3: Generate Admin SDK Service Account Key

1. In Firebase Console (vayra-prod project), go to **Project settings** (⚙️)
2. Click the **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Click **"Generate key"** in the confirmation dialog
5. A JSON file will download (e.g., `vayra-prod-firebase-adminsdk-xxxxx.json`)
6. **IMPORTANT:** Keep this file secure and never commit it to Git

---

## Step 4: Configure Admin SDK Environment Variables

1. Open the downloaded JSON file
2. Extract these values and add to `.env.local`:

```bash
# Firebase Admin SDK (Server-side only)
FIREBASE_PROJECT_ID=vayra-prod
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@vayra-prod.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

**CRITICAL:** 
- The `FIREBASE_PRIVATE_KEY` must be wrapped in **double quotes**
- Keep the `\n` characters exactly as they appear in the JSON file
- The entire key should be on one line in `.env.local`

---

## Step 5: Update `.firebaserc` with Project ID

1. Open `c:\Users\PC\Vayra-a1\Cursor-v1\.firebaserc`
2. Replace the placeholder with your actual project ID:

```json
{
  "projects": {
    "default": "vayra-prod"
  }
}
```

---

## Step 6: Deploy Firestore Rules and Indexes

1. Open a terminal in your project directory
2. Login to Firebase CLI:
```bash
firebase login
```

3. Select the vayra-prod project:
```bash
firebase use vayra-prod
```

4. Deploy Firestore security rules:
```bash
firebase deploy --only firestore:rules
```

5. Deploy Firestore indexes:
```bash
firebase deploy --only firestore:indexes
```

6. Deploy Storage rules:
```bash
firebase deploy --only storage
```

**Expected Output:**
```
✔  Deploy complete!
```

---

## Step 7: Verify Authentication Settings

1. In Firebase Console (vayra-prod), go to **Authentication** → **Sign-in method**
2. Verify the following providers are **enabled**:
   - ✅ **Email/Password**
   - ✅ **Google**

3. For **Google** provider:
   - Click **Google** → **Edit**
   - Verify **Authorized domains** includes:
     - `localhost`
     - `cursor-v1.vercel.app` (or your Vercel domain)
   - Add any missing domains
   - Click **Save**

---

## Step 8: Test Local Connection

1. Start your Next.js development server:
```bash
npm run dev
```

2. Open `http://localhost:3000`
3. Navigate to `/login` or `/signup`
4. Try signing up with:
   - **Google Sign-In** (click the Google button)
   - **Email/Password** (if form is implemented)

5. After successful sign-in:
   - Go to Firebase Console → **Authentication** → **Users**
   - Verify your new user appears in the list
   - Go to **Firestore Database** → **users** collection
   - Verify a document with your UID was created

---

## Step 9: Update Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **cursor-v1** project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables (copy from your `.env.local`):

**Client Variables (all environments: Production, Preview, Development):**
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
NEXT_PUBLIC_ENABLE_PWA
```

**Server Variables (Production only):**
```
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
```

5. Click **Save** for each variable
6. **Redeploy** your Vercel project to apply the new environment variables

---

## Step 10: Verification Checklist

### ✅ Local Development
- [ ] `.env.local` file exists with all Firebase credentials
- [ ] `npm run dev` starts without Firebase errors
- [ ] Can sign up with Google Auth
- [ ] Can sign up with Email/Password (if implemented)
- [ ] User document created in Firestore `users/` collection
- [ ] No console errors related to Firebase

### ✅ Firebase Console
- [ ] vayra-prod project selected
- [ ] Authentication → Users shows new test users
- [ ] Firestore Database → users collection has documents
- [ ] Firestore Rules deployed successfully
- [ ] Firestore Indexes deployed successfully
- [ ] Storage Rules deployed successfully

### ✅ Vercel Production
- [ ] All environment variables added to Vercel
- [ ] Latest deployment successful
- [ ] Can sign in on production URL
- [ ] User data saves to Firestore from production
- [ ] No CORS or authentication errors

---

## Troubleshooting

### Error: "Firebase: Error (auth/unauthorized-domain)"
**Solution:** Add your domain to Firebase Console → Authentication → Settings → Authorized domains

### Error: "Missing or insufficient permissions"
**Solution:** 
- Verify Firestore rules are deployed: `firebase deploy --only firestore:rules`
- Check user is authenticated before accessing Firestore

### Error: "Firebase Admin SDK initialization failed"
**Solution:**
- Verify `FIREBASE_PRIVATE_KEY` has proper `\n` characters
- Ensure the key is wrapped in double quotes in `.env.local`
- Restart Next.js dev server after changing env vars

### Error: "Cannot find module 'firebase-admin'"
**Solution:**
```bash
npm install firebase-admin
```

---

## Next Steps

Once verification is complete:
1. Commit the Firebase configuration files (but NOT `.env.local`)
2. Update `.gitignore` to exclude `.env.local` and service account JSON files
3. Proceed to Day 6: Subscriptions & Payment Integration
4. Set up Stripe webhooks to work with Firebase Functions

---

## Security Reminders

⚠️ **NEVER commit these files:**
- `.env.local`
- `vayra-prod-firebase-adminsdk-*.json`
- Any file containing private keys

✅ **Safe to commit:**
- `firestore.rules`
- `firestore.indexes.json`
- `firebase.json`
- `.firebaserc`
- `.env.example` (with placeholder values only)
