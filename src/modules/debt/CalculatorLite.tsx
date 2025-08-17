import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator } from 'lucide-react';

interface Debt {
  id: string;
  name: string;
  principal: number;
  rate: number;
  minPayment: number;
}

interface CalculatorState {
  income: number;
  expenses: number;
  debts: Debt[];
}

const CalculatorLite: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    income: 0,
    expenses: 0,
    debts: []
  });

  const [disposableIncome, setDisposableIncome] = useState(0);
  const [payoffEstimate, setPayoffEstimate] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('vayra-calculator-lite');
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to load calculator state:', e);
      }
    }
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    localStorage.setItem('vayra-calculator-lite', JSON.stringify(state));
  }, [state]);

  // Calculate disposable income and payoff estimate
  useEffect(() => {
    const totalMinPayments = state.debts.reduce((sum, debt) => sum + debt.minPayment, 0);
    const disposable = state.income - state.expenses - totalMinPayments;
    setDisposableIncome(disposable);

    // Naive payoff estimate: total debt / disposable income (months)
    const totalDebt = state.debts.reduce((sum, debt) => sum + debt.principal, 0);
    const estimate = disposable > 0 ? Math.ceil(totalDebt / disposable) : 0;
    setPayoffEstimate(estimate);
  }, [state]);

  const addDebt = () => {
    const newDebt: Debt = {
      id: Date.now().toString(),
      name: '',
      principal: 0,
      rate: 0,
      minPayment: 0
    };
    setState(prev => ({
      ...prev,
      debts: [...prev.debts, newDebt]
    }));
  };

  const updateDebt = (id: string, field: keyof Debt, value: string | number) => {
    setState(prev => ({
      ...prev,
      debts: prev.debts.map(debt =>
        debt.id === id ? { ...debt, [field]: value } : debt
      )
    }));
  };

  const removeDebt = (id: string) => {
    setState(prev => ({
      ...prev,
      debts: prev.debts.filter(debt => debt.id !== id)
    }));
  };

  const validateInput = (value: string): number => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : Math.max(0, num);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Debt Calculator (Lite)
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate your disposable income and debt payoff timeline
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Income & Expenses</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monthly Income
                </label>
                <input
                  type="number"
                  value={state.income || ''}
                  onChange={(e) => setState(prev => ({ ...prev, income: validateInput(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monthly Expenses
                </label>
                <input
                  type="number"
                  value={state.expenses || ''}
                  onChange={(e) => setState(prev => ({ ...prev, expenses: validateInput(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Debts</h2>
              <button
                onClick={addDebt}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Debt</span>
              </button>
            </div>

            <div className="space-y-4">
              {state.debts.map((debt) => (
                <div key={debt.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <input
                      type="text"
                      value={debt.name}
                      onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white mr-2"
                      placeholder="Debt name"
                    />
                    <button
                      onClick={() => removeDebt(debt.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                      title="Remove debt"
                      aria-label="Remove debt"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Principal
                      </label>
                      <input
                        type="number"
                        value={debt.principal || ''}
                        onChange={(e) => updateDebt(debt.id, 'principal', validateInput(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Rate (%)
                      </label>
                      <input
                        type="number"
                        value={debt.rate || ''}
                        onChange={(e) => updateDebt(debt.id, 'rate', validateInput(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="0"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Min Payment
                      </label>
                      <input
                        type="number"
                        value={debt.minPayment || ''}
                        onChange={(e) => updateDebt(debt.id, 'minPayment', validateInput(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {state.debts.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Calculator className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No debts added yet. Click "Add Debt" to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Disposable Income</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${disposableIncome.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">per month</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Payoff Estimate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {payoffEstimate > 0 ? `${payoffEstimate} months` : 'N/A'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {payoffEstimate > 0 ? `~${Math.floor(payoffEstimate / 12)} years` : ''}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium mb-2">Summary</h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p>Total Debts: {state.debts.length}</p>
                  <p>Total Debt Amount: ${state.debts.reduce((sum, debt) => sum + debt.principal, 0).toLocaleString()}</p>
                  <p>Total Monthly Payments: ${state.debts.reduce((sum, debt) => sum + debt.minPayment, 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              💡 Note
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              This is a simplified calculation. For more accurate estimates, consider interest rates, 
              payment strategies, and consult with a financial advisor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorLite;
