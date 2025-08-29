import React from 'react';
import { motion } from 'framer-motion';
import { User, Settings } from 'lucide-react';
import RequirePlan from '@/components/auth/RequirePlan';

const ProfilePage: React.FC = () => {
  return (
    <RequirePlan min="starter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
          data-testid="profile-placeholder"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Profile & Settings
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Manage your account, preferences, and personal information
            </p>
          </div>

          {/* Coming Soon Message */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center justify-center mb-4">
              <Settings className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Coming Soon
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Our comprehensive profile management system is under development. You'll soon be able to:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">Update personal information</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">Manage notification preferences</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">Customize dashboard layout</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">Set financial goals</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">Manage subscription settings</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">Export your financial data</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current User Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Current Account Status
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="text-gray-500 dark:text-gray-400 mb-1">Plan</div>
                <div className="font-medium text-gray-900 dark:text-white">Starter</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="text-gray-500 dark:text-gray-400 mb-1">Status</div>
                <div className="font-medium text-green-600">Active</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="text-gray-500 dark:text-gray-400 mb-1">Member Since</div>
                <div className="font-medium text-gray-900 dark:text-white">2025</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </RequirePlan>
  );
};

export default ProfilePage;
