# Firebase Setup Documentation

## Environment Variables

Ensure these environment variables are set in your Vercel deployment:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Firebase Console Configuration

### Authorized Domains

Add these domains to your Firebase Console > Authentication > Settings > Authorized domains:

1. **Production:** `cursor-v1.vercel.app`
2. **Development:** `localhost`
3. **Local Network:** `192.168.1.41` (if needed for local testing)

### Google Sign-In Configuration

1. Go to Firebase Console > Authentication > Sign-in method
2. Enable Google provider
3. Add authorized domains listed above
4. Configure OAuth consent screen if needed

### Firestore Rules

Ensure your Firestore security rules allow authenticated users to access their data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Testing

The application includes runtime assertions to verify Firebase configuration:

- Check browser console for any missing environment variables
- Verify authentication works with test account: `test@vayra.digital`
- Test Google Sign-In on authorized domains
