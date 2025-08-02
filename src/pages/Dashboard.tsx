/**
 * Enhanced Dashboard Page
 * Author: VB Entreprise
 * 
 * At-a-glance health of your agency with KPIs, charts, and quick actions
 */

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import MetricCard from '../components/Dashboard/MetricCard';
import { mockDashboardMetrics } from '../data/mockData';

export default function Dashboard() {
  const { user, getUserRoleName, roles, hasPermission } = useAuth();

  // Add error handling for metrics data
  const metrics = mockDashboardMetrics || [];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">At-a-glance health of your agency - monitor KPIs, track progress, and take quick actions.</p>
      </div>

      {/* Debug Section - Remove this in production */}
      {user && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Debug Information</h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <p><strong>User:</strong> {user.firstName} {user.lastName} ({user.email})</p>
            <p><strong>Role:</strong> {getUserRoleName()}</p>
            <p><strong>Role ID:</strong> {user.roleId}</p>
            <p><strong>Roles loaded:</strong> {roles.length}</p>
            <p><strong>Has leads.read:</strong> {hasPermission('leads', 'read') ? 'Yes' : 'No'}</p>
            <p><strong>Has projects.read:</strong> {hasPermission('projects', 'read') ? 'Yes' : 'No'}</p>
            <p><strong>Has contracts.read:</strong> {hasPermission('contracts', 'read') ? 'Yes' : 'No'}</p>
            <p><strong>Has assets.read:</strong> {hasPermission('assets', 'read') ? 'Yes' : 'No'}</p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <span className="mr-2">+</span>
          New Lead
        </button>
        <button className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <span className="mr-2">+</span>
          New Project
        </button>
        <button className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <span className="mr-2">+</span>
          New Invoice
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.length > 0 ? (
          metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            <p>No metrics data available</p>
          </div>
        )}
      </div>
    </div>
  );
}