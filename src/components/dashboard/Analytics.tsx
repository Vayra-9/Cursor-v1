import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Target, AlertCircle, Clock, Zap } from 'lucide-react';
import { usePlan } from '@/contexts/PlanContext';

interface DebtData {
  id: string;
  name: string;
  balance: number;
  rate: number;
  minPayment: number;
  category: string;
}

interface AnalyticsProps {
  debts?: DebtData[];
  monthlyIncome?: number;
}

const COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', 
  '#10B981', '#EF4444', '#06B6D4', '#84CC16'
];

const Analytics: React.FC<AnalyticsProps> = ({ debts = [], monthlyIncome = 0 }) => {
  const { tier } = usePlan();
  const [selectedPeriod, setSelectedPeriod] = useState<'6m' | '1y' | '2y' | '5y'>('1y');

  // Sample data for demonstration
  const sampleDebts: DebtData[] = [
    { id: '1', name: 'Credit Card', balance: 8500, rate: 18.99, minPayment: 255, category: 'Credit Card' },
    { id: '2', name: 'Student Loan', balance: 25000, rate: 5.5, minPayment: 300, category: 'Student Loan' },
    { id: '3', name: 'Car Loan', balance: 15000, rate: 4.25, minPayment: 350, category: 'Auto Loan' },
    { id: '4', name: 'Personal Loan', balance: 8000, rate: 12.5, minPayment: 200, category: 'Personal Loan' }
  ];

  const displayDebts = debts.length > 0 ? debts : sampleDebts;
  const displayIncome = monthlyIncome || 5000;

  // Calculations
  const totalBalance = displayDebts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinPayments = displayDebts.reduce((sum, debt) => sum + debt.minPayment, 0);
  const avgRate = displayDebts.reduce((sum, debt) => sum + debt.rate, 0) / displayDebts.length;
  
  // DTI Calculation
  const dtiRatio = (totalMinPayments / displayIncome) * 100;
  
  // Debt-free projection (simplified)
  const calculateDebtFreeTime = () => {
    const monthlyPayment = totalMinPayments * 1.5; // Assume 50% extra payment
    const months = Math.ceil(totalBalance / monthlyPayment);
    return months;
  };

  const debtFreeMonths = calculateDebtFreeTime();
  const debtFreeYears = Math.ceil(debtFreeMonths / 12);

  // Interest savings calculation
  const calculateInterestSavings = () => {
    const currentInterest = displayDebts.reduce((sum, debt) => {
      return sum + (debt.balance * debt.rate / 100 / 12);
    }, 0);
    
    const aggressivePayment = totalMinPayments * 2;
    const aggressiveMonths = Math.ceil(totalBalance / aggressivePayment);
    const aggressiveInterest = currentInterest * aggressiveMonths * 0.3; // Simplified
    
    return currentInterest - aggressiveInterest;
  };

  const interestSavings = calculateInterestSavings();

  // Chart data
  const monthlyProgressData = Array.from({ length: 12 }, (_, i) => ({
    month: `Month ${i + 1}`,
    balance: Math.max(0, totalBalance - (totalMinPayments * 1.5 * (i + 1))),
    payment: totalMinPayments * 1.5,
    interest: displayDebts.reduce((sum, debt) => {
      const remainingBalance = Math.max(0, debt.balance - (debt.minPayment * 1.5 * (i + 1)));
      return sum + (remainingBalance * debt.rate / 100 / 12);
    }, 0)
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

  const getDTIStatus = (ratio: number) => {
    if (ratio <= 20) return { status: 'Excellent', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' };
    if (ratio <= 30) return { status: 'Good', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' };
    if (ratio <= 40) return { status: 'Fair', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' };
    return { status: 'Poor', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' };
  };

  const dtiStatus = getDTIStatus(dtiRatio);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive financial insights and projections</p>
        </div>
        <div className="flex space-x-2">
          {['6m', '1y', '2y', '5y'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period as any)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">DTI Ratio</p>
              <p className="text-2xl font-bold">{dtiRatio.toFixed(1)}%</p>
              <p className="text-blue-200 text-sm">{dtiStatus.status}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Debt-Free Time</p>
              <p className="text-2xl font-bold">{debtFreeYears}y</p>
              <p className="text-green-200 text-sm">{debtFreeMonths} months</p>
            </div>
            <Clock className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Interest Savings</p>
              <p className="text-2xl font-bold">${interestSavings.toLocaleString()}</p>
              <p className="text-purple-200 text-sm">Potential</p>
            </div>
            <Zap className="w-8 h-8 text-purple-200" />
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
              <p className="text-orange-100 text-sm">Min Payments</p>
              <p className="text-2xl font-bold">${totalMinPayments.toLocaleString()}</p>
              <p className="text-orange-200 text-sm">Monthly</p>
            </div>
            <DollarSign className="w-8 h-8 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Debt Payoff Projection</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyProgressData}>
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
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#3B82F6" 
                fill="url(#balanceGradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Debt by Category</h3>
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
      </div>

      {/* Detailed Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold mb-4">Payment Strategy Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-4 rounded-lg ${dtiStatus.bg}`}>
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${dtiStatus.color.replace('text-', 'bg-')}`}></div>
              <h4 className="font-medium text-gray-900 dark:text-white">DTI Status</h4>
            </div>
            <p className={`text-2xl font-bold ${dtiStatus.color}`}>{dtiStatus.status}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {dtiRatio.toFixed(1)}% of income goes to debt payments
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <h4 className="font-medium text-gray-900 dark:text-white">Payoff Strategy</h4>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {debtFreeYears} years
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              With aggressive payment strategy
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <h4 className="font-medium text-gray-900 dark:text-white">Interest Savings</h4>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${interestSavings.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Potential savings with faster payoff
            </p>
          </div>
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

export default Analytics;
