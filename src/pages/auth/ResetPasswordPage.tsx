import React from 'react';
import { motion } from 'framer-motion';
import VayraLogo from '@/components/ui/VayraLogo';

const ResetPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        {/* Logo Section */}
        <div className="mb-8 flex justify-center">
          <VayraLogo className="h-16 w-auto" width={320} height={64} />
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
          
          {/* Reset Password Form */}
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter your email address"
                data-testid="reset-email-input"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              data-testid="reset-password-submit"
            >
              Send Reset Link
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 