# Firebase Integration Setup Guide

This guide will help you set up Firebase integration with your ERP system.

## Prerequisites

- Node.js and npm installed
- A Firebase project created in the Firebase Console

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "ERP System")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firebase Services

### Authentication
1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

### Firestore Database
1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you can secure it later)
4. Select a location for your database
5. Click "Done"

### Storage (Optional)
1. Go to "Storage" in the left sidebar
2. Click "Get started"
3. Choose "Start in test mode" for development
4. Select a location for your storage
5. Click "Done"

## Step 3: Get Firebase Configuration

1. In your Firebase project, click the gear icon next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>) to add a web app
5. Enter an app nickname (e.g., "ERP Web App")
6. Click "Register app"
7. Copy the Firebase configuration object

## Step 4: Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

## Step 5: Set Up Firestore Security Rules

In your Firebase Console, go to Firestore Database > Rules and update the rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read roles and permissions
    match /roles/{roleId} {
      allow read: if request.auth != null;
    }
    
    match /permissions/{permissionId} {
      allow read: if request.auth != null;
    }
    
    // Add more specific rules for other collections as needed
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 6: Set Up Storage Rules (if using Storage)

In your Firebase Console, go to Storage > Rules and update the rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 7: Initialize the Database

The ERP system will automatically initialize the database with roles and permissions when you first run the application. However, you can also manually trigger initialization:

```javascript
import { firebaseInitializer } from './src/utils/firebaseInit';

// Initialize database
await firebaseInitializer.initializeDatabase();
```

## Step 8: Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the login page
3. Try creating a new account or signing in with existing credentials
4. Verify that user data is being stored in Firestore

## Features Included

### Authentication
- ✅ Email/password authentication
- ✅ User registration with profile creation
- ✅ Password reset functionality
- ✅ Automatic session management
- ✅ Real-time auth state changes

### Database Operations
- ✅ CRUD operations for all ERP entities
- ✅ Real-time data synchronization
- ✅ Offline support (with limitations)
- ✅ Data validation and error handling

### File Storage
- ✅ File upload and download
- ✅ Image storage for user avatars
- ✅ Document storage for ERP files
- ✅ Secure file access

### Security
- ✅ Role-based access control (RBAC)
- ✅ Permission-based feature access
- ✅ Secure data access rules
- ✅ User session management

## Troubleshooting

### Common Issues

1. **Firebase not initialized**
   - Check that all environment variables are set correctly
   - Verify Firebase project configuration

2. **Authentication errors**
   - Ensure Email/Password authentication is enabled in Firebase Console
   - Check that users exist in Firebase Authentication

3. **Database access denied**
   - Verify Firestore security rules
   - Check that the user is authenticated

4. **Storage access denied**
   - Verify Storage security rules
   - Check file permissions

### Debug Mode

Enable debug logging by adding this to your browser console:

```javascript
localStorage.setItem('debug', 'firebase:*');
```

## Production Deployment

### Security Rules
Before deploying to production, update your security rules to be more restrictive:

```javascript
// Example production rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /roles/{roleId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roleId == 'admin';
    }
    
    // Add more specific rules for your use case
  }
}
```

### Environment Variables
Make sure to set up environment variables in your production environment:

```bash
# Production environment variables
VITE_FIREBASE_API_KEY=your_production_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_production_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_production_project_id
# ... other variables
```

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Storage](https://firebase.google.com/docs/storage)

## Support

If you encounter any issues with the Firebase integration, please check:

1. Firebase Console for error logs
2. Browser console for JavaScript errors
3. Network tab for failed requests
4. Firebase documentation for specific error codes 