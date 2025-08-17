import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ComposedChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Target, AlertCircle, Zap, Clock } from 'lucide-react';
import { usePlan } from '@/contexts/PlanContext';

interface DebtData {
  id: string;
  name: string;
  balance: number;
  rate: number;
  minPayment: number;
  category: string;
}

interface PayoffPlannerProps {
  debts?: DebtData[];
  monthlyIncome?: number;
}

const PayoffPlanner: React.FC<PayoffPlannerProps> = ({ debts = [], monthlyIncome = 0 }) => {
  const { tier } = usePlan();
  const [strategy, setStrategy] = useState<'avalanche' | 'snowball' | 'hybrid'>('avalanche');
  const [extraPayment, setExtraPayment] = useState(500);

  // Sample data for demonstration
  const sampleDebts: DebtData[] = [
    { id: '1', name: 'Credit Card', balance: 8500, rate: 18.99, minPayment: 255, category: 'Credit Card' },
    { id: '2', name: 'Student Loan', balance: 25000, rate: 5.5, minPayment: 300, category: 'Student Loan' },
    { id: '3', name: 'Car Loan', balance: 15000, rate: 4.25, minPayment: 350, category: 'Auto Loan' },
    { id: '4', name: 'Personal Loan', balance: 8000, rate: 12.5, minPayment: 200, category: 'Personal Loan' }
  ];

  const displayDebts = debts.length > 0 ? debts : sampleDebts;
  const displayIncome = monthlyIncome || 5000;

  // Sort debts based on strategy
  const getSortedDebts = () => {
    switch (strategy) {
      case 'avalanche':
        return [...displayDebts].sort((a, b) => b.rate - a.rate);
      case 'snowball':
        return [...displayDebts].sort((a, b) => a.balance - b.balance);
      case 'hybrid':
        return [...displayDebts].sort((a, b) => {
          const scoreA = (a.rate * 0.7) + (a.balance / 10000 * 0.3);
          const scoreB = (b.rate * 0.7) + (b.balance / 10000 * 0.3);
          return scoreB - scoreA;
        });
      default:
        return displayDebts;
    }
  };

  const sortedDebts = getSortedDebts();

  // Calculate payoff timeline
  const calculatePayoffTimeline = () => {
    const timeline = [];
    let remainingDebts = [...sortedDebts];
    let totalPaid = 0;
    let month = 0;

    while (remainingDebts.length > 0 && month < 120) { // Max 10 years
      month++;
      let monthlyPayment = remainingDebts.reduce((sum, debt) => sum + debt.minPayment, 0) + extraPayment;
      let monthData: any = { month: `Month ${month}`, totalPaid: 0, remainingBalance: 0 };

      // Pay off debts in order
      for (let i = 0; i < remainingDebts.length; i++) {
        const debt = remainingDebts[i];
        const payment = Math.min(monthlyPayment, debt.balance);
        
        debt.balance -= payment;
        monthlyPayment -= payment;
        totalPaid += payment;

        if (debt.balance <= 0) {
          remainingDebts.splice(i, 1);
          i--;
        }
      }

      monthData.totalPaid = totalPaid;
      monthData.remainingBalance = remainingDebts.reduce((sum, debt) => sum + debt.balance, 0);
      monthData.debtsRemaining = remainingDebts.length;

      timeline.push(monthData);

      if (remainingDebts.length === 0) break;
    }

    return timeline;
  };

  const payoffTimeline = calculatePayoffTimeline();
  const totalMonths = payoffTimeline.length;
  const totalYears = Math.ceil(totalMonths / 12);

  // Calculate interest savings
  const calculateInterestSavings = () => {
    const originalInterest = displayDebts.reduce((sum, debt) => {
      return sum + (debt.balance * debt.rate / 100 / 12 * 60); // 5 years of interest
    }, 0);

    const newInterest = payoffTimeline.reduce((sum, month) => {
      return sum + (month.remainingBalance * 0.08 / 12); // Simplified calculation
    }, 0);

    return originalInterest - newInterest;
  };

  const interestSavings = calculateInterestSavings();

  // Waterfall chart data
  const waterfallData = sortedDebts.map((debt, index) => ({
    name: debt.name,
    balance: debt.balance,
    payment: debt.minPayment,
    remaining: debt.balance - debt.minPayment,
    order: index + 1
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payoff Strategy Planner</h2>
          <p className="text-gray-600 dark:text-gray-400">Optimize your debt payoff with advanced strategies</p>
        </div>
        <div className="flex space-x-2">
          {['avalanche', 'snowball', 'hybrid'].map((strat) => (
            <button
              key={strat}
              onClick={() => setStrategy(strat as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                strategy === strat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {strat.charAt(0).toUpperCase() + strat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`p-6 rounded-xl border-2 transition-colors ${
            strategy === 'avalanche'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
          }`}
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className={`w-3 h-3 rounded-full ${strategy === 'avalanche' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Avalanche Method</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Pay off highest interest rate debts first. Saves the most money on interest.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`p-6 rounded-xl border-2 transition-colors ${
            strategy === 'snowball'
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
          }`}
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className={`w-3 h-3 rounded-full ${strategy === 'snowball' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Snowball Method</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Pay off smallest balances first. Provides quick wins and motivation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className={`p-6 rounded-xl border-2 transition-colors ${
            strategy === 'hybrid'
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
          }`}
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className={`w-3 h-3 rounded-full ${strategy === 'hybrid' ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Hybrid Approach</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Balance interest rates and balance sizes for optimal results.
          </p>
        </motion.div>
      </div>

      {/* Extra Payment Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Extra Monthly Payment</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Additional amount to apply to your highest priority debt
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={extraPayment}
              onChange={(e) => setExtraPayment(Number(e.target.value))}
              className="w-32"
            />
            <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              ${extraPayment.toLocaleString()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Time to Debt-Free</p>
              <p className="text-2xl font-bold">{totalYears}y {totalMonths % 12}m</p>
            </div>
            <Clock className="w-8 h-8 text-blue-200" />
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
              <p className="text-green-100 text-sm">Interest Savings</p>
              <p className="text-2xl font-bold">${interestSavings.toLocaleString()}</p>
            </div>
            <Zap className="w-8 h-8 text-green-200" />
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
              <p className="text-purple-100 text-sm">Monthly Payment</p>
              <p className="text-2xl font-bold">${(displayDebts.reduce((sum, debt) => sum + debt.minPayment, 0) + extraPayment).toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-200" />
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
              <p className="text-orange-100 text-sm">Strategy</p>
              <p className="text-2xl font-bold">{strategy.charAt(0).toUpperCase() + strategy.slice(1)}</p>
            </div>
            <Target className="w-8 h-8 text-orange-200" />
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
          <h3 className="text-lg font-semibold mb-4">Payoff Timeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={payoffTimeline}>
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
                dataKey="remainingBalance" 
                stroke="#3B82F6" 
                fill="url(#balanceGradient)"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="totalPaid" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Debt Priority Order</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={waterfallData}>
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
              <Bar dataKey="balance" fill="url(#priorityGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="priorityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.9}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

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
                Upgrade to Pro for Advanced Payoff Strategies
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

export default PayoffPlanner;
