/**
 * Admin Setup Page
 * 
 * This page allows you to create an admin user and remove the current user
 * for development and testing purposes
 */

import React, { useState } from 'react';
import { setupAdminUser, getAdminCredentials } from '../utils/createAdminUser';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../store';
import { Shield, User, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'initial' | 'confirm' | 'success' | 'error'>('initial');
  const [errorMessage, setErrorMessage] = useState('');
  const { logout } = useAuth();
  const { addNotification } = useNotifications();

  const adminCredentials = getAdminCredentials();

  const handleSetupAdmin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const result = await setupAdminUser();
      
      if (result.success) {
        setStep('success');
        addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: 'Admin Setup Complete',
          message: 'Admin user created successfully!',
          timestamp: new Date(),
          read: false
        });
      } else {
        setStep('error');
        setErrorMessage(result.message);
        addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Admin Setup Failed',
          message: result.message,
          timestamp: new Date(),
          read: false
        });
      }
    } catch (error) {
      setStep('error');
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(message);
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Admin Setup Failed',
        message,
        timestamp: new Date(),
        read: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Setup Complete!</h2>
            <p className="text-gray-600 mb-6">
              The admin user has been created successfully. You can now log in with the admin credentials.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Admin Credentials:</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Email:</span> {adminCredentials.email}
                </div>
                <div>
                  <span className="font-medium">Password:</span> {adminCredentials.password}
                </div>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Failed</h2>
            <p className="text-gray-600 mb-4">
              There was an error setting up the admin user.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </div>
            
            <button
              onClick={() => setStep('initial')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <Shield className="mx-auto h-16 w-16 text-blue-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Setup</h2>
          <p className="text-gray-600">
            This will create an admin user with full system access and remove the current user.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Warning:</p>
                <p>This action will:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Remove the current user from the system</li>
                  <li>Create a new admin user with full permissions</li>
                  <li>Sign you out of the current session</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <User className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">New Admin User:</p>
                <p>Email: {adminCredentials.email}</p>
                <p>Password: {adminCredentials.password}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => window.history.back()}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSetupAdmin}
            disabled={isLoading}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Setting up...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Setup Admin
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 