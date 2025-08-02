/**
 * Clear Notifications Utility
 * Author: VB Entreprise
 * 
 * Utility to clear corrupted notifications from localStorage
 */

/**
 * Clear all notifications from localStorage
 * Run this in browser console: clearAllNotifications()
 */
export function clearAllNotifications(): string {
  try {
    // Get the current store data
    const storeData = localStorage.getItem('erp-store');
    
    if (!storeData) {
      return '✅ No store data found in localStorage';
    }
    
    const parsedData = JSON.parse(storeData);
    
    // Clear notifications
    if (parsedData.state && parsedData.state.notifications) {
      parsedData.state.notifications = [];
      
      // Save back to localStorage
      localStorage.setItem('erp-store', JSON.stringify(parsedData));
      
      return '✅ All notifications cleared from localStorage. Please refresh the page.';
    }
    
    return '✅ No notifications found to clear';
    
  } catch (error) {
    console.error('❌ Error clearing notifications:', error);
    return `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

/**
 * Reset the entire store to default state
 * Run this in browser console: resetStore()
 */
export function resetStore(): string {
  try {
    // Remove the store from localStorage
    localStorage.removeItem('erp-store');
    
    return '✅ Store reset successfully. Please refresh the page.';
    
  } catch (error) {
    console.error('❌ Error resetting store:', error);
    return `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

/**
 * Check and fix corrupted notifications
 * Run this in browser console: fixNotifications()
 */
export function fixNotifications(): string {
  try {
    const storeData = localStorage.getItem('erp-store');
    
    if (!storeData) {
      return '✅ No store data found';
    }
    
    const parsedData = JSON.parse(storeData);
    
    if (!parsedData.state || !parsedData.state.notifications) {
      return '✅ No notifications found';
    }
    
    // Check for corrupted notifications (those without proper timestamp)
    const validNotifications = parsedData.state.notifications.filter((notification: any) => {
      return notification && 
             notification.timestamp && 
             (notification.timestamp instanceof Date || 
              typeof notification.timestamp === 'string' ||
              (typeof notification.timestamp === 'object' && notification.timestamp.__type === 'Date'));
    });
    
    if (validNotifications.length !== parsedData.state.notifications.length) {
      parsedData.state.notifications = validNotifications;
      localStorage.setItem('erp-store', JSON.stringify(parsedData));
      
      return `✅ Fixed notifications. Removed ${parsedData.state.notifications.length - validNotifications.length} corrupted notifications. Please refresh the page.`;
    }
    
    return '✅ All notifications are valid';
    
  } catch (error) {
    console.error('❌ Error fixing notifications:', error);
    return `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

// Make functions available globally for browser console access
if (typeof window !== 'undefined') {
  (window as any).clearAllNotifications = clearAllNotifications;
  (window as any).resetStore = resetStore;
  (window as any).fixNotifications = fixNotifications;
  
  console.log('🔧 Notification utilities loaded!');
  console.log('💡 Run: clearAllNotifications() to clear all notifications');
  console.log('💡 Run: resetStore() to reset the entire store');
  console.log('💡 Run: fixNotifications() to fix corrupted notifications');
} 