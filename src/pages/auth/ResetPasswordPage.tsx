import React from 'react';
import { motion } from 'framer-motion';
import VayraLogo from '@/components/ui/VayraLogo';

const ResetPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        {/* Logo Section */}
        <div className="mb-6 flex justify-center">
          <VayraLogo className="h-10 w-auto" width={200} height={40} />
        </div>

        {/* Reset Password Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Set New Password
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create a strong new password for your account
            </p>
          </div>
          
          {/* Placeholder for reset password form */}
          <div className="space-y-4">
            <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg animate-pulse"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 