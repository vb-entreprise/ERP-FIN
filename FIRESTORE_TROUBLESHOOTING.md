# Firestore 400 Bad Request Troubleshooting Guide

## Problem Description
You're experiencing `GET https://firestore.googleapis.com/... 400 (Bad Request)` errors after successful authentication. This indicates that while Firebase Authentication is working, Firestore operations are being blocked by security rules.

## Root Cause Analysis
The 400 errors occur because:
1. **Firestore security rules are not deployed** - Rules exist locally but haven't been pushed to Firebase
2. **Rules are too restrictive** - Deployed rules don't allow the operations your app is trying to perform
3. **Authentication state mismatch** - User is authenticated but rules don't recognize the auth state

## Quick Fix Steps

### Step 1: Deploy Firestore Security Rules
The most common cause is that your `firestore.rules` file exists locally but hasn't been deployed to Firebase.

**Option A: Use the Diagnostic Tool**
1. Go to `/firebase-test` in your app
2. Click "Deploy Firestore Rules" button
3. Check the results for success/failure

**Option B: Manual Deployment**
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not already done)
firebase init

# Deploy Firestore rules
firebase deploy --only firestore:rules
```

### Step 2: Verify Rules Deployment
After deployment, test if the rules are working:

1. **Check Firebase Console:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your project
   - Go to Firestore Database → Rules
   - Verify your rules are displayed and active

2. **Test with Diagnostic Tool:**
   - Go to `/firebase-test` in your app
   - Click "Run Full Diagnostic"
   - Check if Firestore operations are now working

### Step 3: Verify Current Rules
Your current `firestore.rules` should look like this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read roles and permissions
    match /roles/{roleId} {
      allow read: if request.auth != null;
    }
    
    match /permissions/{permissionId} {
      allow read: if request.auth != null;
    }
    
    // Allow authenticated users to read and write to test collection
    match /test/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read and write to all other collections
    // This is a more permissive rule for development - you may want to restrict this in production
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Detailed Troubleshooting

### 1. Check Firebase CLI Installation
```bash
firebase --version
```
If not installed:
```bash
npm install -g firebase-tools
```

### 2. Check Firebase Login Status
```bash
firebase login --list
```
If not logged in:
```bash
firebase login
```

### 3. Check Project Configuration
```bash
firebase projects:list
firebase use <your-project-id>
```

### 4. Validate Rules Syntax
```bash
firebase deploy --only firestore:rules --dry-run
```

### 5. Check Firestore Database Status
- Go to Firebase Console → Firestore Database
- Ensure Firestore is enabled for your project
- Check if there are any billing issues

## Common Error Messages and Solutions

### "Permission denied"
- **Cause:** Rules are too restrictive
- **Solution:** Deploy the permissive rules above for development

### "Missing or insufficient permissions"
- **Cause:** User not properly authenticated
- **Solution:** Check authentication state in browser console

### "Project not found"
- **Cause:** Wrong project ID in configuration
- **Solution:** Verify project ID in `.env` file and Firebase config

### "Rules deployment failed"
- **Cause:** Syntax error in rules or CLI issues
- **Solution:** Check rules syntax and Firebase CLI installation

## Testing After Deployment

### 1. Browser Console Test
```javascript
// Test if Firestore is working
import { getFirestore, doc, getDoc } from 'firebase/firestore';
const db = getFirestore();

// Try to read a test document
const testDoc = doc(db, 'test', 'test-doc');
getDoc(testDoc).then(doc => {
  console.log('✅ Firestore is working');
}).catch(error => {
  console.error('❌ Firestore error:', error);
});
```

### 2. App Diagnostic Test
1. Go to `/firebase-test`
2. Click "Run Full Diagnostic"
3. Check if Firestore operations pass

### 3. Manual Authentication Test
1. Sign in to your app
2. Check browser console for Firestore errors
3. Try to access a page that uses Firestore

## Production Considerations

For production, you should replace the permissive rules with more restrictive ones:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Specific collection rules
    match /projects/{projectId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         request.auth.token.role == 'admin');
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Additional Resources

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase CLI Documentation](https://firebase.google.com/docs/cli)
- [Firestore Rules Playground](https://firebase.google.com/docs/firestore/security/test-rules-emulator)

## Support

If you're still experiencing issues after following these steps:

1. Check the browser console for specific error messages
2. Run the diagnostic tool at `/firebase-test`
3. Verify your Firebase project configuration
4. Check if your Firebase project has Firestore enabled
5. Ensure your billing is set up correctly for Firestore usage 