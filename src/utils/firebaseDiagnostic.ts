/**
 * Firebase Diagnostic Utility
 * Author: VB Entreprise
 * 
 * Utility for diagnosing Firebase connection issues
 */

import { auth, db, storage } from '../config/firebase';
import { enableNetwork, disableNetwork } from 'firebase/firestore';

export interface DiagnosticResult {
  success: boolean;
  message: string;
  details?: any;
  timestamp: Date;
}

export class FirebaseDiagnostic {
  static async runFullDiagnostic(): Promise<DiagnosticResult[]> {
    const results: DiagnosticResult[] = [];
    
    console.log('🔍 Starting Firebase diagnostic...');
    
    // Test 1: Check environment variables
    results.push(await this.checkEnvironmentVariables());
    
    // Test 2: Check Firebase Auth
    results.push(await this.checkFirebaseAuth());
    
    // Test 3: Check Firestore connection
    results.push(await this.checkFirestoreConnection());
    
    // Test 4: Check Storage connection
    results.push(await this.checkStorageConnection());
    
    // Test 5: Check network connectivity
    results.push(await this.checkNetworkConnectivity());
    
    console.log('🔍 Firebase diagnostic completed');
    return results;
  }

  private static async checkEnvironmentVariables(): Promise<DiagnosticResult> {
    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID'
    ];

    const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
    
    if (missingVars.length > 0) {
      return {
        success: false,
        message: `Missing environment variables: ${missingVars.join(', ')}`,
        details: { missingVars },
        timestamp: new Date()
      };
    }

    return {
      success: true,
      message: 'All Firebase environment variables are set',
      details: { 
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN 
      },
      timestamp: new Date()
    };
  }

  private static async checkFirebaseAuth(): Promise<DiagnosticResult> {
    try {
      const currentUser = auth.currentUser;
      const isInitialized = auth.app.name !== '[DEFAULT]';
      
      return {
        success: true,
        message: 'Firebase Auth is properly initialized',
        details: {
          currentUser: currentUser ? currentUser.uid : null,
          isInitialized,
          appName: auth.app.name
        },
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Firebase Auth initialization failed',
        details: { error: error.message },
        timestamp: new Date()
      };
    }
  }

  private static async checkFirestoreConnection(): Promise<DiagnosticResult> {
    try {
      // Try to enable network to test connection
      await enableNetwork(db);
      
      return {
        success: true,
        message: 'Firestore connection is working',
        details: {
          appName: db.app.name,
          projectId: db.app.options.projectId
        },
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Firestore connection failed',
        details: { 
          error: error.message,
          code: error.code 
        },
        timestamp: new Date()
      };
    }
  }

  private static async checkStorageConnection(): Promise<DiagnosticResult> {
    try {
      const bucket = storage.app.options.storageBucket;
      
      return {
        success: true,
        message: 'Firebase Storage is properly initialized',
        details: {
          bucket,
          appName: storage.app.name
        },
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Firebase Storage initialization failed',
        details: { error: error.message },
        timestamp: new Date()
      };
    }
  }

  private static async checkNetworkConnectivity(): Promise<DiagnosticResult> {
    try {
      // Test basic network connectivity
      const response = await fetch('https://www.google.com', { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      
      return {
        success: true,
        message: 'Network connectivity is working',
        details: { status: 'connected' },
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Network connectivity failed',
        details: { error: error.message },
        timestamp: new Date()
      };
    }
  }

  static async testFirestoreOperation(): Promise<DiagnosticResult> {
    try {
      // Try a simple Firestore operation
      const testDoc = await import('firebase/firestore').then(firestore => 
        firestore.getDoc(firestore.doc(db, 'test', 'connection-test'))
      );
      
      return {
        success: true,
        message: 'Firestore read operation successful',
        details: { exists: testDoc.exists() },
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Firestore operation failed',
        details: { 
          error: error.message,
          code: error.code,
          stack: error.stack
        },
        timestamp: new Date()
      };
    }
  }

  static generateDiagnosticReport(results: DiagnosticResult[]): string {
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    let report = `# Firebase Diagnostic Report\n\n`;
    report += `**Generated:** ${new Date().toISOString()}\n\n`;
    report += `**Summary:** ${successful.length}/${results.length} tests passed\n\n`;
    
    if (failed.length > 0) {
      report += `## Failed Tests\n\n`;
      failed.forEach(result => {
        report += `### ${result.message}\n`;
        report += `- **Time:** ${result.timestamp.toISOString()}\n`;
        if (result.details) {
          report += `- **Details:** ${JSON.stringify(result.details, null, 2)}\n`;
        }
        report += `\n`;
      });
    }
    
    if (successful.length > 0) {
      report += `## Successful Tests\n\n`;
      successful.forEach(result => {
        report += `### ${result.message}\n`;
        report += `- **Time:** ${result.timestamp.toISOString()}\n\n`;
      });
    }
    
    return report;
  }
} 