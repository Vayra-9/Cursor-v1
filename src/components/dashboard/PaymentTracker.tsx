import React from 'react';
import { DollarSign, Plus } from 'lucide-react';

const PaymentTracker: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Tracker</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Track and log payments</p>
          </div>
        </div>
        <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Payment tracking module coming soon...</p>
      </div>
    </div>
  );
};

export default PaymentTracker; 