import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, User, Settings, LogOut, Crown, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePlan } from '@/contexts/PlanContext';
import { motion, AnimatePresence } from 'framer-motion';

const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const { currentPlan, subscription } = usePlan();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const getUserInitials = () => {
    if (user?.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'premium':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'pro':
        return 'bg-gradient-to-r from-blue-500 to-purple-500';
      case 'starter':
        return 'bg-gradient-to-r from-green-500 to-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label="User menu"
      >
        <div className="relative">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {getUserInitials()}
            </span>
          </div>
          {currentPlan !== 'free' && (
            <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${getPlanColor(currentPlan)}`} />
          )}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {user?.displayName || user?.email}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {currentPlan} Plan
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="py-1">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.displayName || 'User'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(currentPlan)} text-white`}>
                    {currentPlan === 'premium' && <Crown className="w-3 h-3 mr-1" />}
                    {currentPlan === 'pro' && <CreditCard className="w-3 h-3 mr-1" />}
                    {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
                  </span>
                  {user?.isGrandfathered && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      Grandfathered
                    </span>
                  )}
                </div>
              </div>

              {/* Menu Items */}
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <User className="mr-3 h-4 w-4" />
                Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <Settings className="mr-3 h-4 w-4" />
                Settings
              </Link>
              
              {/* Subscription Info */}
              {subscription && (
                <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                  <p>Next billing: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
                  {subscription.cancelAtPeriodEnd && (
                    <p className="text-orange-600 dark:text-orange-400">Cancels at period end</p>
                  )}
                </div>
              )}

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default UserMenu; 