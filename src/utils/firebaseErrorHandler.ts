/**
 * Firebase Error Handler Utility
 * 
 * Provides comprehensive error handling for Firebase services,
 * including suppression of known internal Firestore errors
 */

// Types for error handling
interface FirebaseErrorInfo {
  code?: string;
  message: string;
  details?: any;
}

/**
 * Check if an error is a Firestore internal assertion error
 */
export const isFirestoreInternalError = (error: any): boolean => {
  const errorMessage = error?.message || error?.toString() || '';
  return errorMessage.includes('FIRESTORE') && 
         errorMessage.includes('INTERNAL ASSERTION FAILED');
};

/**
 * Check if an error is a Firebase authentication error
 */
export const isFirebaseAuthError = (error: any): boolean => {
  const errorCode = error?.code || '';
  return errorCode.startsWith('auth/');
};

/**
 * Check if an error is a Firestore permission error
 */
export const isFirestorePermissionError = (error: any): boolean => {
  const errorCode = error?.code || '';
  return errorCode === 'permission-denied' || 
         errorCode === 'unavailable' ||
         errorCode === 'unauthenticated';
};

/**
 * Handle Firebase errors with appropriate logging and user feedback
 */
export const handleFirebaseError = (error: any, context?: string): FirebaseErrorInfo => {
  const errorInfo: FirebaseErrorInfo = {
    code: error?.code,
    message: error?.message || error?.toString() || 'Unknown Firebase error',
    details: error
  };

  // Suppress internal Firestore errors
  if (isFirestoreInternalError(error)) {
    console.warn('⚠️ Firestore internal error suppressed:', {
      context,
      error: errorInfo.message
    });
    return errorInfo;
  }

  // Handle authentication errors
  if (isFirebaseAuthError(error)) {
    console.error('🔐 Firebase authentication error:', {
      context,
      code: errorInfo.code,
      message: errorInfo.message
    });
    return errorInfo;
  }

  // Handle Firestore permission errors
  if (isFirestorePermissionError(error)) {
    console.error('🚫 Firestore permission error:', {
      context,
      code: errorInfo.code,
      message: errorInfo.message
    });
    return errorInfo;
  }

  // Handle other Firebase errors
  console.error('❌ Firebase error:', {
    context,
    code: errorInfo.code,
    message: errorInfo.message
  });

  return errorInfo;
};

/**
 * Setup global error handlers for Firebase errors
 */
export const setupFirebaseErrorHandlers = () => {
  // Handle console.error for Firestore internal errors
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const message = args.join(' ');
    if (message.includes('FIRESTORE') && message.includes('INTERNAL ASSERTION FAILED')) {
      console.warn('⚠️ Firestore internal error suppressed:', message);
      return;
    }
    originalConsoleError.apply(console, args);
  };

  // Handle unhandled promise rejections
  const originalUnhandledRejection = window.onunhandledrejection;
  window.onunhandledrejection = (event) => {
    const errorMessage = event.reason?.message || event.reason?.toString() || '';
    if (errorMessage.includes('FIRESTORE') && errorMessage.includes('INTERNAL ASSERTION FAILED')) {
      console.warn('⚠️ Firestore internal promise error suppressed:', errorMessage);
      event.preventDefault();
      return;
    }
    if (originalUnhandledRejection) {
      originalUnhandledRejection.call(window, event);
    }
  };

  // Handle global errors
  const handleGlobalError = (event: ErrorEvent) => {
    const errorMessage = event.error?.message || event.message || '';
    if (errorMessage.includes('FIRESTORE') && errorMessage.includes('INTERNAL ASSERTION FAILED')) {
      console.warn('⚠️ Global Firestore internal error caught:', errorMessage);
      event.preventDefault();
      return false;
    }
  };

  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    const errorMessage = event.reason?.message || event.reason?.toString() || '';
    if (errorMessage.includes('FIRESTORE') && errorMessage.includes('INTERNAL ASSERTION FAILED')) {
      console.warn('⚠️ Global Firestore promise error caught:', errorMessage);
      event.preventDefault();
      return false;
    }
  };

  window.addEventListener('error', handleGlobalError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);

  // Return cleanup function
  return () => {
    window.removeEventListener('error', handleGlobalError);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  };
};

/**
 * Wrapper for Firebase operations with error handling
 */
export const withFirebaseErrorHandling = async <T>(
  operation: () => Promise<T>,
  context?: string
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    const errorInfo = handleFirebaseError(error, context);
    
    // Re-throw non-internal errors
    if (!isFirestoreInternalError(error)) {
      throw error;
    }
    
    // For internal errors, return a default value or re-throw based on context
    throw new Error(`Firebase operation failed: ${errorInfo.message}`);
  }
}; 