import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Crown, Check, ArrowRight, Star, Zap, Rocket } from 'lucide-react';
import VayraLogo from '@/components/ui/VayraLogo';
import { useAuth } from '@/contexts/AuthContext';

const Upgrade: React.FC = () => {
  const { user } = useAuth();

  const plans = [
    {
      name: 'Free',
      tier: 'free',
      price: '$0',
      description: 'Perfect for getting started',
      features: [
        'Up to 3 debt accounts',
        'Basic debt tracking',
        'Simple payment reminders',
        'Community support'
      ],
      icon: Star,
      color: 'from-gray-400 to-gray-600'
    },
    {
      name: 'Starter',
      tier: 'starter',
      price: '$9.99',
      description: 'Great for individuals',
      features: [
        'Up to 10 debt accounts',
        'Advanced debt tracking',
        'Payment scheduling',
        'Email support',
        'Basic reports'
      ],
      icon: Zap,
      color: 'from-green-400 to-blue-500'
    },
    {
      name: 'Pro',
      tier: 'pro',
      price: '$19.99',
      description: 'Perfect for families',
      features: [
        'Unlimited debt accounts',
        'Income tracking',
        'Advanced analytics',
        'Priority support',
        'Custom categories',
        'Data export'
      ],
      icon: Crown,
      color: 'from-blue-500 to-purple-500'
    },
    {
      name: 'Premium',
      tier: 'premium',
      price: '$39.99',
      description: 'For serious debt freedom',
      features: [
        'Everything in Pro',
        'AI-powered insights',
        'Dedicated support',
        'White-label options',
        'API access',
        'Custom integrations'
      ],
      icon: Rocket,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const currentPlan = user?.preferences?.plan || 'free';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <VayraLogo className="h-16 w-auto" width={320} height={64} />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Unlock Your Full Potential
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          >
            Choose the perfect plan to accelerate your journey to financial freedom. 
            {currentPlan !== 'free' && (
              <span className="block mt-2 text-sm text-gray-500">
                You're currently on the <span className="font-semibold capitalize">{currentPlan}</span> plan.
              </span>
            )}
          </motion.p>
        </div>

        {/* Plans Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            const isCurrentPlan = currentPlan === plan.tier;
            
            return (
              <motion.div
                key={plan.tier}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 transition-all duration-300 hover:shadow-2xl ${
                  isCurrentPlan 
                    ? 'border-blue-500 ring-4 ring-blue-500/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                }`}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Current Plan
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${plan.color} mb-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {plan.price}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    per month
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={isCurrentPlan ? "/dashboard" : "/auth/sign-up"}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    isCurrentPlan
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-default'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  }`}
                  data-testid="cta-upgrade-get-started"
                >
                  {isCurrentPlan ? (
                    <>
                      <Check className="w-4 h-4" />
                      Current Plan
                    </>
                  ) : (
                    <>
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Accelerate Your Debt Freedom?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Join thousands of users who have already transformed their financial lives with Vayra.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth/sign-up"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                data-testid="cta-upgrade-get-started"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                data-testid="btn-back-dashboard"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Upgrade;
