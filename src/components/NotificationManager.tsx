/**
 * Notification Manager Component
 * Author: VB Entreprise
 * 
 * Manages multiple notifications and provides a centralized notification system
 */

import React, { useState, useEffect } from 'react';
import Notification, { NotificationProps } from './Notification';

export interface NotificationItem extends Omit<NotificationProps, 'onClose'> {
  id: string;
  timestamp: Date;
}

interface NotificationManagerProps {
  notifications: NotificationItem[];
  onRemoveNotification: (id: string) => void;
  maxNotifications?: number;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({
  notifications,
  onRemoveNotification,
  maxNotifications = 5
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    // Sort notifications by timestamp (newest first) and limit to maxNotifications
    const sortedNotifications = notifications
      .map(notification => ({
        ...notification,
        // Ensure timestamp is a Date object
        timestamp: notification.timestamp instanceof Date 
          ? notification.timestamp 
          : new Date(notification.timestamp)
      }))
      .sort((a, b) => {
        // Safely get timestamp values
        const aTime = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
        const bTime = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
        return bTime - aTime;
      })
      .slice(0, maxNotifications);

    setVisibleNotifications(sortedNotifications);
  }, [notifications, maxNotifications]);

  const handleClose = (id: string) => {
    onRemoveNotification(id);
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {visibleNotifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{
            transform: `translateY(${index * 80}px)`,
            zIndex: 1000 - index,
          }}
        >
          <Notification
            {...notification}
            onClose={handleClose}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationManager; 