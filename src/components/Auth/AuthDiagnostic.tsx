import React, { useState } from 'react';
import { firebaseService } from '../../services/firebase';

interface DiagnosticResult {
  test: string;
  success: boolean;
  message: string;
  details?: any;
}

export default function AuthDiagnostic() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('TestPassword123!');

  const runDiagnostic = async () => {
    setIsRunning(true);
    setResults([]);

    const diagnosticResults: DiagnosticResult[] = [];

    // Test 1: Firebase Configuration
    try {
      const configResult = await firebaseService.checkFirebaseConfig();
      diagnosticResults.push({
        test: 'Firebase Configuration',
        success: configResult.success,
        message: configResult.message,
        details: configResult.data
      });
    } catch (error: any) {
      diagnosticResults.push({
        test: 'Firebase Configuration',
        success: false,
        message: `Configuration check failed: ${error.message}`,
        details: error
      });
    }

    // Test 2: Create Test User
    try {
      const createResult = await firebaseService.createTestUser(testEmail, testPassword);
      diagnosticResults.push({
        test: 'Create Test User',
        success: createResult.success,
        message: createResult.message,
        details: createResult.data
      });
    } catch (error: any) {
      diagnosticResults.push({
        test: 'Create Test User',
        success: false,
        message: `User creation failed: ${error.message}`,
        details: error
      });
    }

    // Test 3: Authentication Test
    try {
      const authResult = await firebaseService.testAuthConnection(testEmail, testPassword);
      diagnosticResults.push({
        test: 'Authentication Test',
        success: authResult.success,
        message: authResult.message,
        details: authResult.data
      });
    } catch (error: any) {
      diagnosticResults.push({
        test: 'Authentication Test',
        success: false,
        message: `Authentication test failed: ${error.message}`,
        details: error
      });
    }

    // Test 4: Sign In Test
    try {
      const signInResult = await firebaseService.signIn(testEmail, testPassword);
      diagnosticResults.push({
        test: 'Sign In Test',
        success: signInResult.success,
        message: signInResult.message,
        details: signInResult.data
      });
    } catch (error: any) {
      diagnosticResults.push({
        test: 'Sign In Test',
        success: false,
        message: `Sign in test failed: ${error.message}`,
        details: error
      });
    }

    setResults(diagnosticResults);
    setIsRunning(false);
  };

  const getStatusColor = (success: boolean) => {
    return success ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (success: boolean) => {
    return success ? '✅' : '❌';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Firebase Authentication Diagnostic
        </h1>

        {/* Test Configuration */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Test Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Email
              </label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="test@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Password
              </label>
              <input
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="TestPassword123!"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-6">
          <button
            onClick={runDiagnostic}
            disabled={isRunning}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isRunning ? 'Running Diagnostics...' : 'Run Authentication Diagnostic'}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Diagnostic Results</h2>
            {results.map((result, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{result.test}</h3>
                  <span className={`font-semibold ${getStatusColor(result.success)}`}>
                    {getStatusIcon(result.success)} {result.success ? 'PASS' : 'FAIL'}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{result.message}</p>
                {result.details && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-blue-600 text-sm">
                      View Details
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Troubleshooting Tips */}
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">Troubleshooting Tips</h3>
          <ul className="space-y-2 text-sm text-yellow-700">
            <li>• Check that Email/Password authentication is enabled in Firebase Console</li>
            <li>• Verify your Firebase project is active and billing is enabled</li>
            <li>• Ensure all environment variables are correctly set</li>
            <li>• Check the browser console for detailed error messages</li>
            <li>• Verify your internet connection</li>
            <li>• Make sure the user exists in Firebase Authentication</li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => window.open('https://console.firebase.google.com', '_blank')}
              className="p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              Open Firebase Console
            </button>
            <button
              onClick={() => window.open('https://firebase.google.com/docs/auth', '_blank')}
              className="p-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
            >
              Auth Documentation
            </button>
            <button
              onClick={() => {
                console.log('Firebase Config:', {
                  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
                  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
                  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
                });
                alert('Firebase config logged to console');
              }}
              className="p-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
            >
              Log Config to Console
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 