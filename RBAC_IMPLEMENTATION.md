# Role-Based Access Control (RBAC) Implementation

## Overview

This ERP system implements a comprehensive Role-Based Access Control (RBAC) system that provides fine-grained permission management across all modules. The system is designed to be secure, scalable, and user-friendly.

## Architecture

### Core Components

1. **Authentication Context** (`src/contexts/AuthContext.tsx`)
   - Manages user authentication state
   - Provides permission checking functions
   - Handles login/logout functionality

2. **Protected Route Component** (`src/components/Auth/ProtectedRoute.tsx`)
   - Wraps routes with permission checks
   - Redirects unauthorized users
   - Shows appropriate error messages

3. **Permission Gate Component** (`src/components/Auth/PermissionGate.tsx`)
   - Conditionally renders content based on permissions
   - Provides fallback content options
   - Supports lock icon display

4. **Role Management** (`src/pages/Settings/RoleManagement.tsx`)
   - Administrative interface for role management
   - View and manage permissions
   - Create/edit custom roles

## User Roles

### 1. Administrator
- **Description**: Full system access with all permissions
- **Permissions**: All system permissions
- **Use Case**: System administrators, IT managers

### 2. Manager
- **Description**: Department manager with oversight permissions
- **Permissions**: 
  - CRM: Read, create, update (no delete)
  - Projects: Read, create, update
  - Finance: Read, create, update, approve expenses
  - HR: Read employees, approve timesheets
  - Reports: Read, export
  - Helpdesk: Read, create, update tickets

### 3. Employee
- **Description**: Standard employee with limited permissions
- **Permissions**:
  - CRM: Read, create (no update/delete)
  - Projects: Read only
  - Tasks: Read, create, update
  - Finance: Read invoices, create expenses
  - HR: Read, create timesheets
  - Reports: Read only
  - Helpdesk: Read, create tickets

### 4. Viewer
- **Description**: Read-only access to most modules
- **Permissions**: Read access to most resources, no create/update/delete

## Permission System

### Permission Format
Permissions follow the format: `{resource}.{action}`

### Available Actions
- `read`: View data
- `create`: Create new records
- `update`: Edit existing records
- `delete`: Remove records
- `approve`: Approve workflows/expenses
- `export`: Export data/reports

### Resource Categories
- `leads`, `contacts`, `opportunities`, `proposals` (CRM)
- `projects`, `tasks` (Project Management)
- `invoices`, `payments`, `expenses` (Finance)
- `employees`, `timesheets` (HR)
- `campaigns` (Marketing)
- `reports` (Reporting)
- `tickets` (Helpdesk)
- `contracts` (Documents)
- `settings`, `roles` (System)

## Implementation Examples

### 1. Route Protection
```tsx
<Route path="/crm/leads" element={
  <ProtectedRoute requiredPermission={{ resource: 'leads', action: 'read' }}>
    <Leads />
  </ProtectedRoute>
} />
```

### 2. Conditional Content Rendering
```tsx
<PermissionGate resource="leads" action="create">
  <button>Add New Lead</button>
</PermissionGate>
```

### 3. Permission Checking in Components
```tsx
const { hasPermission } = useAuth();
const canEdit = hasPermission('leads', 'update');
```

### 4. Role-Based Navigation
The sidebar automatically filters navigation items based on user permissions.

## Demo Users

### Login Credentials
1. **Admin User**
   - Email: `admin@vberp.com`
   - Password: `password123`
   - Role: Administrator

2. **Manager User**
   - Email: `manager@vberp.com`
   - Password: `password123`
   - Role: Manager

3. **Employee User**
   - Email: `employee@vberp.com`
   - Password: `password123`
   - Role: Employee

4. **Viewer User**
   - Email: `viewer@vberp.com`
   - Password: `password123`
   - Role: Viewer

## Features

### 1. Authentication
- Login/logout functionality
- Session persistence
- Role-based user identification

### 2. Permission Management
- Fine-grained permission control
- Resource and action-based permissions
- Role-based permission inheritance

### 3. UI Integration
- Dynamic navigation filtering
- Conditional button rendering
- Permission-based content display

### 4. Security
- Route-level protection
- Component-level permission gates
- Automatic redirects for unauthorized access

### 5. User Experience
- Clear permission feedback
- Intuitive role indicators
- Graceful degradation for restricted features

## Usage Examples

### Checking Permissions
```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { hasPermission, hasRole } = useAuth();
  
  const canEditLeads = hasPermission('leads', 'update');
  const isAdmin = hasRole('Administrator');
  
  return (
    <div>
      {canEditLeads && <button>Edit Lead</button>}
      {isAdmin && <button>System Settings</button>}
    </div>
  );
}
```

### Protecting Routes
```tsx
import ProtectedRoute from '../components/Auth/ProtectedRoute';

<ProtectedRoute requiredPermission={{ resource: 'finance', action: 'read' }}>
  <FinanceDashboard />
</ProtectedRoute>
```

### Conditional Rendering
```tsx
import PermissionGate from '../components/Auth/PermissionGate';

<PermissionGate resource="reports" action="export">
  <button>Export Report</button>
</PermissionGate>
```

## Security Considerations

1. **Client-Side Security**: This is a demo implementation. In production, all permission checks should be validated server-side.

2. **Token Management**: Implement proper JWT or session token management.

3. **API Security**: Ensure all API endpoints validate permissions server-side.

4. **Audit Logging**: Implement comprehensive audit logging for security events.

5. **Session Management**: Implement proper session timeout and management.

## Future Enhancements

1. **Dynamic Permissions**: Allow runtime permission changes
2. **Permission Groups**: Group related permissions for easier management
3. **Time-Based Permissions**: Temporary permission grants
4. **Location-Based Access**: Geographic access restrictions
5. **Advanced Role Inheritance**: Hierarchical role structures
6. **Permission Analytics**: Track permission usage and effectiveness

## Testing

### Manual Testing
1. Login with different user roles
2. Navigate to various pages
3. Verify permission-based content visibility
4. Test unauthorized access handling

### Automated Testing
```tsx
// Example test for permission checking
test('user with leads.read permission can view leads page', () => {
  // Test implementation
});
```

## Troubleshooting

### Common Issues
1. **Permission not working**: Check permission format and user role
2. **Navigation items missing**: Verify user has required permissions
3. **Login issues**: Check user credentials and role assignment

### Debug Mode
Enable debug logging to troubleshoot permission issues:
```tsx
// Add to AuthContext for debugging
console.log('Permission check:', resource, action, hasPermission(resource, action));
```

## Conclusion

This RBAC implementation provides a robust foundation for secure, scalable access control in the ERP system. The modular design allows for easy extension and customization while maintaining security best practices. 