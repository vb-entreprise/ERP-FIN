# Firebase Connection Troubleshooting Guide

## Overview

This guide helps resolve Firebase Firestore 400 Bad Request errors and connection issues in the ERP application.

## Common Issues and Solutions

### 1. Environment Variables Missing

**Symptoms:**
- Firebase initialization fails
- "Missing environment variables" error
- Authentication works but Firestore fails

**Solution:**
1. Create a `.env` file in your project root
2. Add the following variables:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

3. Get these values from your Firebase Console:
   - Go to Project Settings
   - Scroll down to "Your apps"
   - Copy the configuration values

### 2. Firestore Security Rules Not Deployed

**Symptoms:**
- 400 Bad Request errors
- "Permission denied" errors
- Connection works but operations fail

**Solution:**
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Deploy Firestore rules:
   ```bash
   node deploy-firestore-rules.js
   ```

   Or manually:
   ```bash
   firebase deploy --only firestore:rules
   ```

### 3. Firestore Not Enabled

**Symptoms:**
- "Firestore is not enabled" error
- Cannot access Firestore database

**Solution:**
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Click "Create database"
4. Choose a location
5. Start in production mode

### 4. Network Connectivity Issues

**Symptoms:**
- "Network request failed" errors
- Timeout errors
- Intermittent connection failures

**Solution:**
1. Check your internet connection
2. Verify firewall settings
3. Try disabling VPN if using one
4. Check if Firebase services are down: https://status.firebase.google.com/

### 5. Project Configuration Issues

**Symptoms:**
- Wrong project ID errors
- Authentication works but database operations fail

**Solution:**
1. Verify your project ID in Firebase Console
2. Check that your app is configured for the correct project
3. Ensure billing is enabled for the project

## Diagnostic Tools

### 1. Firebase Test Page

Navigate to `/firebase-test` in your application to run diagnostics:

- Environment variable checks
- Firebase service initialization tests
- Authentication tests
- Firestore connection tests
- Network connectivity tests

### 2. Console Diagnostics

Run this in your browser console:

```javascript
// Test Firebase configuration
console.log('Firebase Config:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'Set' : 'Missing',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Missing',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'Set' : 'Missing',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? 'Set' : 'Missing',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? 'Set' : 'Missing',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ? 'Set' : 'Missing'
});

// Test Firestore connection
import { db } from './src/config/firebase';
import { enableNetwork } from 'firebase/firestore';

enableNetwork(db).then(() => {
  console.log('✅ Firestore network enabled');
}).catch(error => {
  console.error('❌ Firestore network error:', error);
});
```

## Step-by-Step Resolution

### Step 1: Verify Environment Variables

1. Check that all Firebase environment variables are set
2. Restart your development server after adding variables
3. Clear browser cache and reload

### Step 2: Deploy Firestore Rules

1. Run the deployment script:
   ```bash
   node deploy-firestore-rules.js
   ```

2. Or deploy manually:
   ```bash
   firebase login
   firebase use your-project-id
   firebase deploy --only firestore:rules
   ```

### Step 3: Test Connection

1. Navigate to the Firebase Test page in your app
2. Run the full diagnostic
3. Check for any failed tests
4. Address any issues found

### Step 4: Verify in Firebase Console

1. Go to Firebase Console
2. Check Firestore Database is enabled
3. Verify security rules are deployed
4. Check for any error messages

## Advanced Troubleshooting

### Debug Mode

Enable detailed Firebase logging:

```javascript
// Add to your main.tsx or App.tsx
import { initializeApp } from 'firebase/app';

if (import.meta.env.DEV) {
  // Enable debug mode in development
  console.log('Firebase Debug Mode Enabled');
}
```

### Network Monitoring

Check network requests in browser DevTools:

1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "firestore"
4. Look for failed requests
5. Check request/response details

### Error Codes Reference

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `permission-denied` | Security rules blocking access | Deploy Firestore rules |
| `unavailable` | Network connectivity issue | Check internet connection |
| `deadline-exceeded` | Request timeout | Check network speed |
| `not-found` | Document doesn't exist | Check document path |
| `already-exists` | Document already exists | Use updateDoc instead of setDoc |

## Prevention

### Best Practices

1. **Always deploy Firestore rules** after making changes
2. **Test in development** before deploying to production
3. **Monitor Firebase Console** for any service issues
4. **Use proper error handling** in your application
5. **Keep Firebase SDK updated** to latest version

### Monitoring

1. Set up Firebase Console alerts
2. Monitor application logs
3. Use Firebase Analytics to track errors
4. Set up error reporting (Sentry, etc.)

## Support

If issues persist:

1. Check Firebase Status: https://status.firebase.google.com/
2. Review Firebase Documentation: https://firebase.google.com/docs
3. Check Firebase Community: https://firebase.google.com/community
4. Contact Firebase Support if needed

## Quick Fix Checklist

- [ ] Environment variables set correctly
- [ ] Firebase project exists and is active
- [ ] Firestore Database is enabled
- [ ] Security rules are deployed
- [ ] Firebase CLI is installed and logged in
- [ ] Internet connection is stable
- [ ] No firewall blocking Firebase
- [ ] Application is using correct project ID
- [ ] Billing is enabled for the project
- [ ] Firebase SDK is up to date 