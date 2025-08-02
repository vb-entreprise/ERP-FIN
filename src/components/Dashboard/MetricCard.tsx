/**
 * Metric Card Component
 * Author: VB Entreprise
 * 
 * Displays key performance metrics with trend indicators
 * Used throughout the dashboard for various KPIs
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { DashboardMetric } from '../../types';

interface MetricCardProps {
  metric: DashboardMetric;
}

export default function MetricCard({ metric }: MetricCardProps) {
  // Add error handling for missing or undefined metric
  if (!metric) {
    console.warn('MetricCard: metric prop is undefined or null');
    return (
      <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <p>No data available</p>
        </div>
      </div>
    );
  }

  // Add error handling for missing trend property
  const trend = metric.trend || 'neutral';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  
  const trendColor = trend === 'up' 
    ? 'text-emerald-600' 
    : trend === 'down' 
    ? 'text-red-600' 
    : 'text-gray-400';

  // Add error handling for missing change property
  const change = metric.change || 0;

  // Add error handling for missing label and value
  const label = metric.label || 'Unknown Metric';
  const value = metric.value || 'N/A';

  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {label}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${trendColor}`}>
                  <TrendIcon className="self-center flex-shrink-0 h-4 w-4" />
                  <span className="ml-1">
                    {Math.abs(change)}%
                  </span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}