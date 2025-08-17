import React from 'react';
import { CreditCard } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

const DebtDashboard: React.FC = () => {
  const { formatCurrency } = useCurrency();

  const mockData = {
    totalDebt: 45250,
    totalPaid: 8750,
    progressPercentage: 16.2,
    debts: [
      { id: 1, name: 'Chase Credit Card', balance: 2450, interestRate: 18.99 },
      { id: 2, name: 'Student Loan', balance: 28000, interestRate: 5.5 },
      { id: 3, name: 'Car Loan', balance: 14800, interestRate: 4.25 }
    ]
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <CreditCard className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Debt Overview</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Track your debt progress</p>
          </div>
        </div>
        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Total Debt</span>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatCurrency(mockData.totalDebt)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Total Paid</span>
          <span className="text-lg font-semibold text-green-600 dark:text-green-400">
            {formatCurrency(mockData.totalPaid)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {mockData.progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${mockData.progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Recent Debts</h4>
          <div className="space-y-3">
            {mockData.debts.slice(0, 2).map((debt) => (
              <div key={debt.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{debt.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{debt.interestRate}% APR</p>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(debt.balance)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtDashboard; 