import React from 'react';
import { Shield } from 'lucide-react';

const EmergencyBudgetKit: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
          <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Emergency Budget Kit</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Budget templates for crisis scenarios</p>
        </div>
      </div>
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Emergency budget module coming soon...</p>
      </div>
    </div>
  );
};

export default EmergencyBudgetKit; 