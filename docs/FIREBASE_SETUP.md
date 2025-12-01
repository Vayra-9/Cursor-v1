# Firebase Setup Guide for VAYRA

## Overview
This guide provides complete instructions for setting up Firebase for the VAYRA Next.js application.

## Prerequisites
- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- A Google account
- Access to Firebase Console

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `vayra-production` (or your choice)
4. Enable Google Analytics (optional)
5. Click "Create Project"

## Step 2: Enable Firebase Services

### Authentication
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** provider
   - Add your support email
   - Add authorized domains: `localhost`, `cursor-v1.vercel.app`

### Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Select **Production mode**
4. Choose a location (e.g., `us-central1`)
5. Click "Enable"

### Storage
1. Go to **Storage**
2. Click "Get Started"
3. Use default security rules (we'll update them later)
4. Choose same location as Firestore

## Step 3: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click the **Web** icon (`</>`)
4. Register app with nickname: `VAYRA Web`
5. Copy the `firebaseConfig` object

## Step 4: Configure Environment Variables

1. Create `.env.local` in your project root:

```bash
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Admin SDK (Server-side)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# PWA
NEXT_PUBLIC_ENABLE_PWA=true
```

## Step 5: Get Service Account Key (Admin SDK)

1. In Firebase Console, go to **Project Settings** > **Service Accounts**
2. Click "Generate new private key"
3. Save the JSON file securely
4. Extract the following values:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the `\n` characters)

## Step 6: Deploy Firestore Security Rules

```bash
cd c:\Users\PC\Vayra-a1\Cursor-v1
firebase login
firebase use --add
# Select your project
firebase deploy --only firestore:rules
```

## Step 7: Deploy Firestore Indexes

```bash
firebase deploy --only firestore:indexes
```

## Step 8: Initialize Firestore Collections

You can manually create the first document in each collection, or they will be created automatically when your app writes data.

### Recommended Initial Collections:
- `users/` - User profiles
- `debts/` - Debt records
- `payments/` - Payment history
- `expenses/` - Expense tracking
- `budgets/` - Budget plans
- `income/` - Income sources
- `plans/` - Subscription plans (admin-managed)

## Step 9: Verify Setup

1. Start your Next.js app:
```bash
npm run dev
```

2. Navigate to `http://localhost:3000`
3. Try signing up with Google
4. Check Firebase Console > Authentication to see the new user
5. Check Firestore to see the user document created

## Firestore Schema Reference

### users/{userId}
```json
{
  "uid": "string",
  "email": "string",
  "displayName": "string",
  "photoURL": "string",
  "plan": "starter|pro|premium",
  "grandfathered": false,
  "planVersion": "v1_early|v2_standard",
  "createdAt": 1234567890,
  "updatedAt": 1234567890,
  "softDelete": false
}
```

### debts/{debtId}
```json
{
  "id": "string",
  "userId": "string",
  "name": "string",
  "balance": 5000,
  "interestRate": 15.5,
  "minimumPayment": 100,
  "category": "Credit Card",
  "createdAt": 1234567890,
  "updatedAt": 1234567890
}
```

### budgets/{budgetId}
```json
{
  "id": "string",
  "userId": "string",
  "month": "2025-12",
  "category": "Food",
  "limit": 500,
  "spent": 250,
  "createdAt": 1234567890,
  "updatedAt": 1234567890
}
```

## Security Rules Summary

The deployed `firestore.rules` file enforces:
- ✅ Users can only access their own data
- ✅ Authenticated users required for all writes
- ✅ Pro/Premium features gated by plan
- ✅ Grandfathered users bypass plan restrictions
- ✅ Soft delete only (no hard deletes)

## Troubleshooting

### "Permission denied" errors
- Check that Firestore rules are deployed
- Verify user is authenticated
- Check user's plan in Firestore

### "Firebase not initialized"
- Verify `.env.local` exists and has correct values
- Restart Next.js dev server after changing env vars

### Admin SDK errors
- Verify service account key is correct
- Check that `FIREBASE_PRIVATE_KEY` has proper line breaks (`\n`)

## Next Steps
- Set up Stripe for payments (Day 6)
- Configure App Check for security
- Set up Firebase Cloud Functions for webhooks
- Enable Firebase Analytics
