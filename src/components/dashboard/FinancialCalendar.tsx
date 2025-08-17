import React from 'react';
import { Calendar } from 'lucide-react';

const FinancialCalendar: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
          <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Financial Calendar</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Payment reminders & milestones</p>
        </div>
      </div>
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Financial calendar module coming soon...</p>
      </div>
    </div>
  );
};

export default FinancialCalendar; 