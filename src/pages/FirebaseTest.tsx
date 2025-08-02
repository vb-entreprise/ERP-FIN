/**
 * Firebase Test Page
 * Author: VB Entreprise
 * 
 * Test page for Firebase functionality and diagnostics
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FirebaseDiagnostic } from '../utils/firebaseDiagnostic';
import { firebaseService } from '../services/firebase';

interface DiagnosticResult {
  success: boolean;
  message: string;
  details?: any;
  timestamp: Date;
}

const FirebaseTest: React.FC = () => {
  const { user, login, logout } = useAuth();
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([]);
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('testpassword123');
  const [loginResult, setLoginResult] = useState<string>('');
  const [firestoreTestResult, setFirestoreTestResult] = useState<string>('');

  const runDiagnostic = async () => {
    setIsRunningDiagnostic(true);
    try {
      const results = await FirebaseDiagnostic.runFullDiagnostic();
      setDiagnosticResults(results);
      
      // Also test Firestore operation
      const firestoreTest = await FirebaseDiagnostic.testFirestoreOperation();
      setFirestoreTestResult(firestoreTest.success ? '✅ Success' : `❌ Failed: ${firestoreTest.message}`);
    } catch (error) {
      console.error('Diagnostic failed:', error);
      setDiagnosticResults([{
        success: false,
        message: 'Diagnostic failed to run',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date()
      }]);
    } finally {
      setIsRunningDiagnostic(false);
    }
  };

  const testLogin = async () => {
    try {
      setLoginResult('Testing login...');
      const result = await login(testEmail, testPassword);
      if (result.success) {
        setLoginResult('✅ Login successful');
      } else {
        setLoginResult(`❌ Login failed: ${result.message}`);
      }
    } catch (error) {
      setLoginResult(`❌ Login error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testLogout = async () => {
    try {
      await logout();
      setLoginResult('✅ Logout successful');
    } catch (error) {
      setLoginResult(`❌ Logout error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const generateReport = () => {
    const report = FirebaseDiagnostic.generateDiagnosticReport(diagnosticResults);
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `firebase-diagnostic-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Firebase Test & Diagnostics</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Diagnostic Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Diagnostics</h2>
              
              <button
                onClick={runDiagnostic}
                disabled={isRunningDiagnostic}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isRunningDiagnostic ? 'Running Diagnostic...' : 'Run Full Diagnostic'}
              </button>
              
              {diagnosticResults.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Results:</h3>
                    <button
                      onClick={generateReport}
                      className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                    >
                      Download Report
                    </button>
                  </div>
                  
                  {diagnosticResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        result.success 
                          ? 'bg-green-50 border-green-200 text-green-800' 
                          : 'bg-red-50 border-red-200 text-red-800'
                      }`}
                    >
                      <div className="font-medium">{result.message}</div>
                      <div className="text-sm opacity-75">
                        {result.timestamp.toLocaleTimeString()}
                      </div>
                      {result.details && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm">Details</summary>
                          <pre className="text-xs mt-1 bg-gray-100 p-2 rounded overflow-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {firestoreTestResult && (
                <div className="p-3 rounded-lg border bg-blue-50 border-blue-200">
                  <div className="font-medium">Firestore Test:</div>
                  <div className="text-sm">{firestoreTestResult}</div>
                </div>
              )}
            </div>

            {/* Authentication Test Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Authentication Test</h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Email:
                  </label>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Password:
                  </label>
                  <input
                    type="password"
                    value={testPassword}
                    onChange={(e) => setTestPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={testLogin}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Test Login
                  </button>
                  
                  <button
                    onClick={testLogout}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Test Logout
                  </button>
                </div>
                
                {loginResult && (
                  <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                    <div className="font-medium">Result:</div>
                    <div className="text-sm">{loginResult}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Current User Status */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Current User Status:</h3>
            {user ? (
              <div className="space-y-1 text-sm">
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Name:</strong> {user.firstName} {user.lastName}</div>
                <div><strong>Role:</strong> {user.roleId}</div>
                <div><strong>Department:</strong> {user.department}</div>
                <div><strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}</div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">No user logged in</div>
            )}
          </div>

          {/* Troubleshooting Tips */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-medium text-yellow-800 mb-2">Troubleshooting Tips:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Check that all Firebase environment variables are set in your .env file</li>
              <li>• Verify your Firebase project is active and Firestore is enabled</li>
              <li>• Deploy Firestore security rules using: <code className="bg-yellow-100 px-1 rounded">firebase deploy --only firestore:rules</code></li>
              <li>• Ensure you have a stable internet connection</li>
              <li>• Check Firebase Console for any service outages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseTest; 