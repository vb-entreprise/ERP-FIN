/**
 * Login Page Component
 * Author: VB Entreprise
 * 
 * Authentication page with role-based login options
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { firebaseService } from '../services/firebase';
import { mockUsers } from '../data/mockData';
import { Building2, Eye, EyeOff, AlertCircle, CheckCircle, UserPlus, Lock } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign up new user
        const response = await firebaseService.signUp(email, password, {
          firstName,
          lastName,
          department,
          position,
          roleId: 'employee' // Default role for new users
        });

        if (response.success && response.data) {
          setSuccess('Account created successfully! Please sign in.');
          setIsSignUp(false);
          setFirstName('');
          setLastName('');
          setDepartment('');
          setPosition('');
        } else {
          throw new Error(response.message || 'Sign up failed');
        }
      } else {
        // Sign in existing user
        const loginResult = await login(email, password);
        
        if (loginResult.success) {
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } else {
          // Enhanced error handling
          const errorMessage = loginResult.message || 'Authentication failed';
          setError(errorMessage);
          
          // Log detailed error for debugging
          console.error('Login failed:', {
            email,
            error: loginResult.error,
            message: loginResult.message
          });
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      console.error('Authentication error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await firebaseService.resetPassword(email);
      if (response.success) {
        setSuccess('Password reset email sent! Check your inbox.');
      } else {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setPassword('password123'); // Default password for demo
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await login(userEmail, 'password123');
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <Building2 className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to ERP System
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* Login/Signup Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {isSignUp && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required={isSignUp}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required={isSignUp}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Last name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                      Department
                    </label>
                    <input
                      id="department"
                      name="department"
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Department"
                    />
                  </div>
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                      Position
                    </label>
                    <input
                      id="position"
                      name="position"
                      type="text"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Position"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                  placeholder={isSignUp ? 'Create a password' : 'Enter your password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="flex items-center p-4 text-sm text-red-800 border border-red-200 rounded-lg bg-red-50">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center p-4 text-sm text-green-800 border border-green-200 rounded-lg bg-green-50">
              <CheckCircle className="h-5 w-5 mr-2" />
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign in')}
          </button>
        </form>

        {/* Toggle Sign Up/Login */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>

        {/* Password Reset */}
        {!isSignUp && (
          <div className="text-center">
            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={isLoading || !email}
              className="text-sm text-gray-600 hover:text-gray-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
            >
              <Lock className="h-4 w-4 mr-1" />
              Forgot your password?
            </button>
          </div>
        )}

        {/* Quick Login Options */}
        <div className="mt-8">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">Quick login for demo:</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {mockUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleQuickLogin(user.email)}
                disabled={isLoading}
                className="flex flex-col items-center p-3 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="h-8 w-8 rounded-full mb-1"
                />
                <span className="text-xs font-medium text-gray-700">
                  {user.firstName}
                </span>
                <span className="text-xs text-gray-500">
                  {user.roleId}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Information</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• <strong>Admin:</strong> Full system access</li>
            <li>• <strong>Manager:</strong> Department oversight</li>
            <li>• <strong>Employee:</strong> Standard permissions</li>
            <li>• <strong>Viewer:</strong> Read-only access</li>
          </ul>
        </div>

        {/* Diagnostic Link */}
        <div className="mt-4 text-center">
          <a
            href="/auth-diagnostic"
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Having login issues? Run Authentication Diagnostic
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login; 