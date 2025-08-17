import React from 'react';
import { motion } from 'framer-motion';
import PricingMatrix from '@/components/pricing/PricingMatrix';
import { usePlan } from '@/contexts/PlanContext';

const PricingPage: React.FC = () => {
  const { currentPlan, grandfathered } = usePlan();

  const handlePlanSelect = (planId: string) => {
    // In a real app, this would redirect to Stripe checkout
    console.log(`Selected plan: ${planId}`);
    // For now, just show an alert
    alert(`You selected the ${planId} plan. This would redirect to payment processing in a real app.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Choose the perfect plan for your financial journey. All plans include our core debt management tools.
          </p>
          
          {/* Current Plan Badge */}
          {currentPlan !== 'free' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium"
            >
              <span>Current Plan: {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}</span>
              {grandfathered && (
                <span className="bg-amber-500 text-white px-2 py-0.5 rounded text-xs">
                  Grandfathered
                </span>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Pricing Matrix */}
        <PricingMatrix 
          showGrandfathered={grandfathered}
          onPlanSelect={handlePlanSelect}
        />

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                What happens to my data if I downgrade?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your data is always safe. If you exceed limits after downgrading, you'll need to upgrade to access additional features.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! All paid plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Absolutely. You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage; 