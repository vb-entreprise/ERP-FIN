# Admin User Setup Instructions

## Overview
This guide will help you remove the current user and create an admin user with full system access.

## Steps to Create Admin User

### 1. Access the Admin Setup Page
Navigate to the admin setup page in your browser:
```
http://localhost:5173/admin-setup
```

### 2. Review the Setup Information
The page will show you:
- **Warning**: What actions will be performed
- **New Admin User**: The credentials for the new admin user
- **Email**: `admin@vbenterprise.com`
- **Password**: `Admin@123456`

### 3. Confirm the Setup
Click the "Setup Admin" button to:
- Remove the current user from the system
- Create a new admin user with full permissions
- Sign you out of the current session

### 4. Login with Admin Credentials
After the setup is complete:
1. You'll be redirected to the login page
2. Use the admin credentials:
   - **Email**: `admin@vbenterprise.com`
   - **Password**: `Admin@123456`

## Admin User Permissions

The admin user will have full access to all system modules:

### Core Modules
- ✅ **CRM**: Leads, Contacts, Opportunities, Proposals
- ✅ **Projects**: Project Management, Task Boards, Gantt Charts
- ✅ **Finance**: Invoices, Payments, Expenses, Tax Settings
- ✅ **Marketing**: Campaigns, Lead Scoring, Landing Pages
- ✅ **Documents**: Contracts, E-Signatures, Version History

### Advanced Modules
- ✅ **Reports**: Custom Reports and Analytics
- ✅ **BI**: Dashboard Designer, Data Warehouse, Predictive Forecasts
- ✅ **Collaboration**: Chat, Activity Feed, Meeting Scheduler
- ✅ **Quality**: Audit Logs, Document Approvals, GDPR Settings
- ✅ **Settings**: Global Settings, Feature Flags, Integrations

### Additional Features
- ✅ **Workflows**: Automation and Approval Chains
- ✅ **Contracts**: Contract Library and Billing Management
- ✅ **Assets**: Inventory and License Tracking

## What the Setup Does

1. **Removes Current User**:
   - Clears local storage
   - Signs out from Firebase
   - Removes user session

2. **Creates Admin Role**:
   - Creates administrator role with all permissions
   - Sets up comprehensive permission system

3. **Creates Admin User**:
   - Creates Firebase authentication user
   - Creates user profile in Firestore
   - Assigns admin role to the user

4. **Sets Up Permissions**:
   - Creates all necessary permissions
   - Links permissions to admin role
   - Enables full system access

## Troubleshooting

### If Setup Fails
1. Check the browser console for error messages
2. Ensure Firebase is properly configured
3. Try refreshing the page and attempting again
4. Check that all environment variables are set correctly

### If Login Fails After Setup
1. Verify you're using the correct credentials
2. Check that the admin user was created successfully
3. Try clearing browser cache and cookies
4. Check Firebase authentication in the Firebase console

## Security Notes

⚠️ **Important**: 
- The admin password is set to `Admin@123456` by default
- Change this password after first login for security
- This setup is intended for development/testing purposes
- For production, use proper user management procedures

## Next Steps

After successful admin setup:
1. Login with admin credentials
2. Explore all system modules
3. Create additional users as needed
4. Configure system settings
5. Set up your organization's data

---

**Need Help?** Check the browser console for detailed error messages or contact the development team. 