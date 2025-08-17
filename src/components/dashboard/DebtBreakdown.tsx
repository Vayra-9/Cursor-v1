import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Target, AlertCircle } from 'lucide-react';
import { usePlan } from '@/contexts/PlanContext';

interface DebtData {
  id: string;
  name: string;
  balance: number;
  rate: number;
  minPayment: number;
  category: string;
}

interface DebtBreakdownProps {
  debts?: DebtData[];
}

const COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', 
  '#10B981', '#EF4444', '#06B6D4', '#84CC16'
];

const DebtBreakdown: React.FC<DebtBreakdownProps> = ({ debts = [] }) => {
  const { tier } = usePlan();
  const [selectedView, setSelectedView] = useState<'overview' | 'timeline' | 'category'>('overview');

  // Sample data for demonstration
  const sampleDebts: DebtData[] = [
    { id: '1', name: 'Credit Card', balance: 8500, rate: 18.99, minPayment: 255, category: 'Credit Card' },
    { id: '2', name: 'Student Loan', balance: 25000, rate: 5.5, minPayment: 300, category: 'Student Loan' },
    { id: '3', name: 'Car Loan', balance: 15000, rate: 4.25, minPayment: 350, category: 'Auto Loan' },
    { id: '4', name: 'Personal Loan', balance: 8000, rate: 12.5, minPayment: 200, category: 'Personal Loan' }
  ];

  const displayDebts = debts.length > 0 ? debts : sampleDebts;

  const totalBalance = displayDebts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinPayments = displayDebts.reduce((sum, debt) => sum + debt.minPayment, 0);
  const avgRate = displayDebts.reduce((sum, debt) => sum + debt.rate, 0) / displayDebts.length;

  // Prepare chart data
  const balanceData = displayDebts.map(debt => ({
    name: debt.name,
    balance: debt.balance,
    minPayment: debt.minPayment,
    rate: debt.rate
  }));

  const categoryData = displayDebts.reduce((acc, debt) => {
    const existing = acc.find(item => item.name === debt.category);
    if (existing) {
      existing.value += debt.balance;
    } else {
      acc.push({ name: debt.category, value: debt.balance });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const timelineData = displayDebts.map((debt, index) => ({
    month: `Month ${index + 1}`,
    balance: debt.balance,
    payment: debt.minPayment,
    remaining: Math.max(0, debt.balance - debt.minPayment * (index + 1))
  }));

  const getStatusColor = (rate: number) => {
    if (rate > 15) return 'text-red-600 dark:text-red-400';
    if (rate > 10) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getPriorityScore = (debt: DebtData) => {
    return (debt.rate * 0.6) + (debt.balance / totalBalance * 0.4);
  };

  const sortedDebts = [...displayDebts].sort((a, b) => getPriorityScore(b) - getPriorityScore(a));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Debt Breakdown</h2>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive analysis of your debt portfolio</p>
        </div>
        <div className="flex space-x-2">
          {['overview', 'timeline', 'category'].map((view) => (
            <button
              key={view}
              onClick={() => setSelectedView(view as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedView === view
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Balance</p>
              <p className="text-2xl font-bold">${totalBalance.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Monthly Payments</p>
              <p className="text-2xl font-bold">${totalMinPayments.toLocaleString()}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Avg Rate</p>
              <p className="text-2xl font-bold">{avgRate.toFixed(1)}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Debt Count</p>
              <p className="text-2xl font-bold">{displayDebts.length}</p>
            </div>
            <Target className="w-8 h-8 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedView === 'overview' && (
          <>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-4">Debt Balance Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={balanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, '']}
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Bar dataKey="balance" fill="url(#balanceGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0.9}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-4">Debt Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Balance']}
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </>
        )}

        {selectedView === 'timeline' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4">Payment Timeline Projection</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, '']}
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="remaining" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {selectedView === 'category' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, '']}
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Bar dataKey="value" fill="url(#categoryGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="categoryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.9}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>

      {/* Priority List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold mb-4">Debt Priority (Payoff Order)</h3>
        <div className="space-y-3">
          {sortedDebts.map((debt, index) => (
            <div
              key={debt.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{debt.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{debt.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">
                  ${debt.balance.toLocaleString()}
                </p>
                <p className={`text-sm font-medium ${getStatusColor(debt.rate)}`}>
                  {debt.rate}% APR
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Pro Upgrade Notice */}
      {tier === 'free' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                Upgrade to Pro for Advanced Analytics
              </h4>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Get detailed payoff strategies, interest savings projections, and personalized recommendations.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DebtBreakdown;
