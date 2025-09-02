import React from 'react';
import { usePlanAccess } from '@/hooks/usePlanAccess';

export function ProOnlyModule() {
  const { isAdmin, hasPlan } = usePlanAccess();
  
  if (!isAdmin && !hasPlan('pro')) {
    return (
      <div 
        data-testid="gate-pro" 
        className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 text-center"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          🔒 Pro Feature Locked
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Upgrade to Pro to access advanced debt payoff planning and analytics.
        </p>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          onClick={() => window.location.href = '/pricing'}
        >
          View Plans
        </button>
      </div>
    );
  }

  return (
    <div 
      data-testid="payoff-planner" 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        🚀 Pro Debt Payoff Planner
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Welcome to your Pro dashboard! Here you can access advanced debt payoff strategies, 
        detailed analytics, and personalized recommendations.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Smart Strategies</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            AI-powered debt payoff recommendations based on your financial profile.
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Advanced Analytics</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Detailed charts and insights to track your progress.
          </p>
        </div>
      </div>
    </div>
  );
}
