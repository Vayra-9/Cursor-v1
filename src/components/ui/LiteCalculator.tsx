import React, { useState } from 'react';

export function LiteCalculator() {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [debt, setDebt] = useState('');
  const disposable = Math.max(0, (Number(income)||0) - (Number(expenses)||0));
  const estimate = debt ? Math.ceil((Number(debt)||0) / Math.max(1, disposable || 1)) : 0;

  return (
    <form data-testid="calculator-form" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lite Debt Calculator</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="income" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Monthly Income
          </label>
          <input 
            id="income"
            data-testid="calc-income" 
            placeholder="Income" 
            value={income} 
            onChange={e=>setIncome(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="expenses" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Monthly Expenses
          </label>
          <input 
            id="expenses"
            data-testid="calc-expenses" 
            placeholder="Expenses" 
            value={expenses} 
            onChange={e=>setExpenses(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="debt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Total Debt
          </label>
          <input 
            id="debt"
            data-testid="calc-debt" 
            placeholder="Total Debt" 
            value={debt} 
            onChange={e=>setDebt(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div data-testid="calculator-result" className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Disposable Income</div>
              <div className="text-2xl font-bold text-green-600" data-testid="disposable">${disposable}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Payoff Estimate</div>
              <div className="text-2xl font-bold text-blue-600" data-testid="payoff-estimate-months">{estimate} months</div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
