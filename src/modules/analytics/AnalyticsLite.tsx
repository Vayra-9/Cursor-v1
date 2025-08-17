import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calculator, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { usePlan } from '@/contexts/PlanContext';

interface DebtData {
  name: string;
  balance: number;
  payment: number;
}

interface AnalyticsState {
  monthlyIncome: number;
  monthlyDebts: DebtData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AnalyticsLite: React.FC = () => {
  const { tier } = usePlan();
  const [state, setState] = useState<AnalyticsState>({
    monthlyIncome: 0,
    monthlyDebts: []
  });

  const [dtiRatio, setDtiRatio] = useState(0);
  const [dtiStatus, setDtiStatus] = useState<'excellent' | 'good' | 'fair' | 'poor'>('excellent');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('vayra-analytics-lite');
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to load analytics data:', e);
      }
    }
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    localStorage.setItem('vayra-analytics-lite', JSON.stringify(state));
  }, [state]);

  // Calculate DTI ratio
  useEffect(() => {
    const totalMonthlyDebt = state.monthlyDebts.reduce((sum, debt) => sum + debt.payment, 0);
    const ratio = state.monthlyIncome > 0 ? (totalMonthlyDebt / state.monthlyIncome) * 100 : 0;
    setDtiRatio(ratio);

    if (ratio <= 20) setDtiStatus('excellent');
    else if (ratio <= 30) setDtiStatus('good');
    else if (ratio <= 40) setDtiStatus('fair');
    else setDtiStatus('poor');
  }, [state]);

  const addDebt = () => {
    const newDebt: DebtData = {
      name: '',
      balance: 0,
      payment: 0
    };
    setState(prev => ({
      ...prev,
      monthlyDebts: [...prev.monthlyDebts, newDebt]
    }));
  };

  const updateDebt = (index: number, field: keyof DebtData, value: string | number) => {
    setState(prev => ({
      ...prev,
      monthlyDebts: prev.monthlyDebts.map((debt, i) =>
        i === index ? { ...debt, [field]: value } : debt
      )
    }));
  };

  const removeDebt = (index: number) => {
    setState(prev => ({
      ...prev,
      monthlyDebts: prev.monthlyDebts.filter((_, i) => i !== index)
    }));
  };

  const validateInput = (value: string): number => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : Math.max(0, num);
  };

  // Prepare chart data
  const debtChartData = state.monthlyDebts.map(debt => ({
    name: debt.name || 'Unnamed Debt',
    balance: debt.balance,
    payment: debt.payment
  }));

  const pieChartData = state.monthlyDebts.map(debt => ({
    name: debt.name || 'Unnamed Debt',
    value: debt.balance
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 dark:text-green-400';
      case 'good': return 'text-blue-600 dark:text-blue-400';
      case 'fair': return 'text-yellow-600 dark:text-yellow-400';
      case 'poor': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'good':
        return <TrendingUp className="w-5 h-5" />;
      case 'fair':
      case 'poor':
        return <TrendingDown className="w-5 h-5" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  // Limit data for free plan
  const isFreePlan = tier === 'free';
  const maxDebts = isFreePlan ? 3 : 10;
  const limitedDebtData = isFreePlan ? debtChartData.slice(0, 3) : debtChartData;
  const limitedPieData = isFreePlan ? pieChartData.slice(0, 3) : pieChartData;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics (Lite)
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Analyze your debt-to-income ratio and visualize your financial data
        </p>
        {isFreePlan && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 Free plan shows limited data. Upgrade to see full analytics.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* DTI Calculator */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
              <h2 className="text-xl font-semibold">DTI Calculator</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monthly Income
                </label>
                <input
                  type="number"
                  value={state.monthlyIncome || ''}
                  onChange={(e) => setState(prev => ({ ...prev, monthlyIncome: validateInput(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="0"
                />
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Monthly Debts</h3>
                {state.monthlyDebts.length < maxDebts && (
                  <button
                    onClick={addDebt}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    + Add Debt
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {state.monthlyDebts.map((debt, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <input
                        type="text"
                        value={debt.name}
                        onChange={(e) => updateDebt(index, 'name', e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white mr-2"
                        placeholder="Debt name"
                      />
                      <button
                        onClick={() => removeDebt(index)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Remove debt"
                        aria-label="Remove debt"
                      >
                        ×
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Balance
                        </label>
                        <input
                          type="number"
                          value={debt.balance || ''}
                          onChange={(e) => updateDebt(index, 'balance', validateInput(e.target.value))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Payment
                        </label>
                        <input
                          type="number"
                          value={debt.payment || ''}
                          onChange={(e) => updateDebt(index, 'payment', validateInput(e.target.value))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* DTI Results */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">DTI Ratio</span>
                  <div className={`flex items-center space-x-1 ${getStatusColor(dtiStatus)}`}>
                    {getStatusIcon(dtiStatus)}
                    <span className="text-sm font-medium capitalize">{dtiStatus}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dtiRatio.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {dtiRatio <= 20 && 'Excellent - You have a healthy debt-to-income ratio'}
                  {dtiRatio > 20 && dtiRatio <= 30 && 'Good - Your debt-to-income ratio is manageable'}
                  {dtiRatio > 30 && dtiRatio <= 40 && 'Fair - Consider reducing debt or increasing income'}
                  {dtiRatio > 40 && 'Poor - Focus on debt reduction and financial planning'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Debt Balance Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Debt Overview</h2>
            {limitedDebtData.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No debt data available. Add your debts to see charts.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={limitedDebtData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                  <Bar dataKey="balance" fill="#0088FE" name="Balance" />
                  <Bar dataKey="payment" fill="#00C49F" name="Payment" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Debt Distribution Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Debt Distribution</h2>
            {limitedPieData.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No debt data available. Add your debts to see distribution.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={limitedPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {limitedPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Balance']} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsLite;
