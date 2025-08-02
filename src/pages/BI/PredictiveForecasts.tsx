/**
 * BI Predictive Forecasts Page
 * Author: VB Entreprise
 * 
 * AI-powered forecasting and predictive analytics
 */

import React, { useState } from 'react';
import { TrendingUp, Brain, Calendar, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Forecast {
  id: string;
  name: string;
  type: 'revenue' | 'sales' | 'churn' | 'demand';
  accuracy: number;
  confidence: number;
  lastUpdated: Date;
  nextUpdate: Date;
  status: 'active' | 'training' | 'error';
}

const mockForecasts: Forecast[] = [
  {
    id: '1',
    name: 'Revenue Forecast',
    type: 'revenue',
    accuracy: 94.2,
    confidence: 87,
    lastUpdated: new Date('2024-01-22'),
    nextUpdate: new Date('2024-01-29'),
    status: 'active'
  },
  {
    id: '2',
    name: 'Customer Churn Prediction',
    type: 'churn',
    accuracy: 89.5,
    confidence: 92,
    lastUpdated: new Date('2024-01-21'),
    nextUpdate: new Date('2024-01-28'),
    status: 'active'
  }
];

const revenueData = [
  { month: 'Jan', actual: 450000, predicted: 465000, confidence: 0.9 },
  { month: 'Feb', actual: 520000, predicted: 535000, confidence: 0.85 },
  { month: 'Mar', actual: null, predicted: 580000, confidence: 0.82 },
  { month: 'Apr', actual: null, predicted: 620000, confidence: 0.78 },
  { month: 'May', actual: null, predicted: 680000, confidence: 0.75 },
  { month: 'Jun', actual: null, predicted: 720000, confidence: 0.72 }
];

export default function PredictiveForecasts() {
  const [forecasts] = useState<Forecast[]>(mockForecasts);

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      training: 'bg-blue-100 text-blue-800',
      error: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'training': return <Brain className="h-4 w-4 text-blue-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Predictive Forecasts</h1>
          <p className="mt-2 text-gray-600">
            AI-powered forecasting and predictive analytics for business planning.
          </p>
        </div>
      </div>

      {/* Forecast Models */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {forecasts.map((forecast) => (
          <div key={forecast.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{forecast.name}</h3>
              <div className="flex items-center">
                {getStatusIcon(forecast.status)}
                <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(forecast.status)}`}>
                  {forecast.status}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Accuracy</p>
                <p className="text-2xl font-bold text-green-600">{forecast.accuracy}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Confidence</p>
                <p className="text-2xl font-bold text-blue-600">{forecast.confidence}%</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              <p>Last updated: {forecast.lastUpdated.toLocaleDateString()}</p>
              <p>Next update: {forecast.nextUpdate.toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Forecast Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Forecast</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`₹${value?.toLocaleString()}`, '']} />
            <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={3} name="Actual" />
            <Line type="monotone" dataKey="predicted" stroke="#3B82F6" strokeWidth={2} strokeDasharray="5 5" name="Predicted" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Model Performance */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">94.2%</div>
            <div className="text-sm text-gray-500">Average Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">89.5%</div>
            <div className="text-sm text-gray-500">Prediction Confidence</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">2.1%</div>
            <div className="text-sm text-gray-500">Mean Absolute Error</div>
          </div>
        </div>
      </div>
    </div>
  );
}