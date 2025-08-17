import React from 'react';
import { Calculator } from 'lucide-react';

const DTICalculator: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
          <Calculator className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">DTI Calculator</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Debt-to-Income ratio calculator</p>
        </div>
      </div>
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>DTI calculator module coming soon...</p>
      </div>
    </div>
  );
};

export default DTICalculator; 