import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, TrendingDown } from 'lucide-react';
import RequirePlan from '@/components/auth/RequirePlan';

const DebtsPage: React.FC = () => {
  return (
    <RequirePlan min="starter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
          data-testid="debts-placeholder"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center mb-6">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Debt Management
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Track, analyze, and conquer your debt with intelligent strategies
            </p>
          </div>

          {/* Coming Soon Message */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center justify-center mb-4">
              <TrendingDown className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Coming Soon
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Our comprehensive debt management system is under development. You'll soon be able to:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">Track all your debts in one place</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">Calculate optimal payoff strategies</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">Monitor interest savings</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">Set payment reminders</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">Visualize debt-free timeline</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">Get AI-powered recommendations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Development in Progress
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full w-3/4 animate-pulse"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </RequirePlan>
  );
};

export default DebtsPage;
