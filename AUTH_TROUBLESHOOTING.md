# Firebase Authentication Troubleshooting Guide

## Issue: 400 Bad Request on Login

You're experiencing 400 Bad Request errors when trying to sign in with Firebase Authentication. This guide will help you diagnose and fix the issue.

## Quick Diagnostic Steps

### 1. Use the Authentication Diagnostic Tool

Navigate to `/auth-diagnostic` in your application to run comprehensive diagnostics:

- Firebase configuration validation
- Test user creation
- Authentication connection testing
- Detailed error reporting

### 2. Check Browser Console

Open your browser's developer tools and check the console for detailed error messages. Look for:

- Firebase configuration errors
- Network request failures
- Authentication error codes

## Common Causes and Solutions

### 1. Firebase Project Configuration Issues

**Problem**: Firebase project not properly configured or services disabled.

**Solution**:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (`vb-erp-fin`)
3. Navigate to Authentication → Sign-in method
4. Enable Email/Password authentication
5. Verify your project is active and billing is enabled

### 2. Environment Variables

**Problem**: Missing or incorrect environment variables.

**Check your `.env` file**:
```env
VITE_FIREBASE_API_KEY=AIzaSyBJ88LHh7kKTKySb1CrWGkT42_ngc_6caA
VITE_FIREBASE_AUTH_DOMAIN=vb-erp-fin.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vb-erp-fin
VITE_FIREBASE_STORAGE_BUCKET=vb-erp-fin.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1026521877952
VITE_FIREBASE_APP_ID=1:1026521877952:web:b55b5887103c31e2994c25
VITE_FIREBASE_MEASUREMENT_ID=G-L8E9EBJC9H
```

### 3. User Account Issues

**Problem**: User doesn't exist or account is disabled.

**Solution**:
1. Go to Firebase Console → Authentication → Users
2. Check if the user exists
3. Verify the user is enabled
4. Check if email verification is required

### 4. Network Connectivity

**Problem**: Network issues preventing Firebase requests.

**Solution**:
1. Check your internet connection
2. Verify no firewall is blocking Firebase requests
3. Try accessing from a different network

## Error Code Reference

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `auth/user-not-found` | User doesn't exist | Create user or check email |
| `auth/wrong-password` | Incorrect password | Verify password |
| `auth/user-disabled` | Account disabled | Enable in Firebase Console |
| `auth/invalid-email` | Malformed email | Check email format |
| `auth/too-many-requests` | Rate limited | Wait and try again |
| `auth/network-request-failed` | Network error | Check connection |
| `auth/invalid-api-key` | Invalid API key | Check environment variables |
| `auth/project-not-found` | Project doesn't exist | Verify project ID |

## Step-by-Step Fix Process

### Step 1: Verify Firebase Configuration

1. **Check Environment Variables**:
   ```bash
   # In your browser console, run:
   console.log('Firebase Config:', {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
   });
   ```

2. **Verify Firebase Console Settings**:
   - Go to Firebase Console
   - Check Authentication is enabled
   - Verify Email/Password sign-in method is active

### Step 2: Test Authentication

1. **Run the Diagnostic Tool**:
   - Navigate to `/auth-diagnostic`
   - Click "Run Authentication Diagnostic"
   - Review the results

2. **Create a Test User**:
   ```javascript
   // In browser console
   import { firebaseService } from './src/services/firebase';
   firebaseService.createTestUser('test@example.com', 'TestPassword123!');
   ```

### Step 3: Check User Accounts

1. **Verify User Exists**:
   - Go to Firebase Console → Authentication → Users
   - Check if your test user exists
   - Verify the user is enabled

2. **Create User if Missing**:
   ```javascript
   // Use the diagnostic tool or run this in console
   firebaseService.createTestUser('your-email@example.com', 'YourPassword123!');
   ```

### Step 4: Test Login

1. **Try the Test Credentials**:
   - Email: `test@example.com`
   - Password: `TestPassword123!`

2. **Check for Specific Errors**:
   - Look at the browser console for detailed error messages
   - Check the network tab for failed requests

## Enhanced Error Handling

The updated Firebase service now includes:

- **Detailed error messages** for common authentication issues
- **Enhanced logging** for debugging
- **Automatic user profile creation** if missing
- **Comprehensive diagnostic tools**

## Testing Your Fix

1. **Run the diagnostic tool** at `/auth-diagnostic`
2. **Try logging in** with test credentials
3. **Check browser console** for any remaining errors
4. **Verify user creation** in Firebase Console

## Common Debugging Commands

```javascript
// Check Firebase configuration
console.log('Firebase Config:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
});

// Test authentication
import { firebaseService } from './src/services/firebase';
firebaseService.testAuthConnection('test@example.com', 'TestPassword123!');

// Create test user
firebaseService.createTestUser('test@example.com', 'TestPassword123!');

// Check Firebase config
firebaseService.checkFirebaseConfig();
```

## Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com)
- [Firebase Error Codes](https://firebase.google.com/docs/auth/admin/errors)
- [Firebase CLI](https://firebase.google.com/docs/cli)

## Support

If you continue to experience issues:

1. **Run the diagnostic tool** and share the results
2. **Check the browser console** for detailed error messages
3. **Verify your Firebase project** is properly configured
4. **Ensure all environment variables** are correctly set
5. **Test with a newly created user account**

## Quick Fix Checklist

- [ ] Enable Email/Password authentication in Firebase Console
- [ ] Verify all environment variables are set
- [ ] Create a test user account
- [ ] Run the authentication diagnostic tool
- [ ] Check browser console for detailed errors
- [ ] Verify Firebase project is active
- [ ] Test with the provided test credentials 