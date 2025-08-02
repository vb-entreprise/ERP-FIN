/**
 * Permission Gate Component
 * Author: VB Entreprise
 * 
 * Conditionally renders content based on user permissions
 */

import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Lock } from 'lucide-react';

interface PermissionGateProps {
  children: ReactNode;
  resource: string;
  action: string;
  fallback?: ReactNode;
  showLockIcon?: boolean;
}

const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  resource,
  action,
  fallback,
  showLockIcon = false
}) => {
  const { hasPermission } = useAuth();

  const hasAccess = hasPermission(resource, action);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showLockIcon) {
      return (
        <div className="flex items-center justify-center p-4 text-gray-400">
          <Lock className="h-4 w-4 mr-2" />
          <span className="text-sm">Access restricted</span>
        </div>
      );
    }

    return null;
  }

  return <>{children}</>;
};

export default PermissionGate; 