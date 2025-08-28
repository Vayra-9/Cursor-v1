# Firestore Security Rules

## Access Model

The VAYRA application expects the following Firestore security rules for proper functionality:

### User Document Access
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User document access
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    
    // User subcollections access
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

### Key Requirements

1. **User Document Access**: Users can only read/write their own user document at `/users/{uid}`
2. **Subcollections**: Users can access all subcollections under their user document at `/users/{uid}/{document=**}`
3. **Authentication Required**: All access requires valid Firebase authentication
4. **UID Matching**: Users can only access documents where the document ID matches their auth UID

### Implementation Notes

- These rules ensure secure user data isolation
- Supports the user document structure with preferences, plan information, and other user-specific data
- Allows for future subcollections like user settings, preferences, etc.
- Maintains security while enabling full application functionality

### Testing

To verify rules are working correctly:
1. Authenticated users should be able to read/write their own user document
2. Users should not be able to access other users' documents
3. Unauthenticated requests should be denied
4. Subcollections under user documents should be accessible to the document owner
