import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Star, ArrowRight, Crown } from 'lucide-react';
import pricingData from '@/data/pricing.json';
import GrandfatheredBadge from '@/components/ui/GrandfatheredBadge';

interface PricingMatrixProps {
  showGrandfathered?: boolean;
  onPlanSelect?: (planId: string) => void;
}

const PricingMatrix: React.FC<PricingMatrixProps> = ({ 
  showGrandfathered = false,
  onPlanSelect 
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [plans, setPlans] = useState(pricingData.plans);
  const [features] = useState(pricingData.features);

  const getFeatureIcon = (featureKey: string) => {
    const feature = features[featureKey as keyof typeof features];
    return feature?.icon || 'Check';
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `$${price.toFixed(2)}`;
  };

  const getYearlyPrice = (monthlyPrice: number) => {
    return monthlyPrice * 12 * 0.8; // 20% discount for yearly
  };

  const handlePlanSelect = (planId: string) => {
    if (onPlanSelect) {
      onPlanSelect(planId);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Yearly
            <span className="ml-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-1.5 py-0.5 rounded">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(plans).map(([planId, plan]) => {
          const price = billingCycle === 'yearly' 
            ? getYearlyPrice(plan.price) 
            : plan.price;
          
          const isGrandfathered = showGrandfathered && 
            pricingData.grandfatheredPlans[`legacy_${planId}` as keyof typeof pricingData.grandfatheredPlans];

          return (
            <motion.div
              key={planId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Object.keys(plans).indexOf(planId) * 0.1 }}
              className={`
                relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2
                ${plan.popular 
                  ? 'border-blue-500 dark:border-blue-400 scale-105' 
                  : 'border-gray-200 dark:border-gray-700'
                }
                hover:shadow-xl transition-all duration-300
              `}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star size={14} />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Grandfathered Badge */}
              {isGrandfathered && (
                <div className="absolute -top-3 right-4">
                  <GrandfatheredBadge size="sm" />
                </div>
              )}

              <div className="p-6">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {formatPrice(price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600 dark:text-gray-400 ml-1">
                        /{billingCycle === 'yearly' ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {Object.entries(plan.features).map(([featureKey, enabled]) => {
                    if (featureKey === 'aiCopilot') {
                      const aiFeature = enabled as { enabled: boolean; promptLimit: number };
                      return (
                        <div key={featureKey} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            AI Money Coach
                            {aiFeature.enabled && aiFeature.promptLimit > 0 && (
                              <span className="text-xs text-gray-500 ml-1">
                                ({aiFeature.promptLimit} prompts)
                              </span>
                            )}
                          </span>
                          {aiFeature.enabled ? (
                            <Check size={16} className="text-green-500" />
                          ) : (
                            <X size={16} className="text-red-500" />
                          )}
                        </div>
                      );
                    }
                    
                    return (
                      <div key={featureKey} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {features[featureKey as keyof typeof features]?.name || featureKey}
                        </span>
                        {enabled ? (
                          <Check size={16} className="text-green-500" />
                        ) : (
                          <X size={16} className="text-red-500" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Limits */}
                {plan.limits && (
                  <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                      Limits
                    </h4>
                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      {plan.limits.maxDebts !== -1 && (
                        <div>Up to {plan.limits.maxDebts} debts</div>
                      )}
                      {plan.limits.maxPayments !== -1 && (
                        <div>Up to {plan.limits.maxPayments} payments</div>
                      )}
                      {plan.limits.maxMonthsHistory !== -1 && (
                        <div>{plan.limits.maxMonthsHistory} months history</div>
                      )}
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <button
                  onClick={() => handlePlanSelect(planId)}
                  className={`
                    w-full py-3 px-4 rounded-lg font-medium transition-colors
                    ${plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                    }
                    flex items-center justify-center gap-2
                  `}
                >
                  {plan.cta}
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Feature Comparison
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Feature
                </th>
                {Object.entries(plans).map(([planId, plan]) => (
                  <th key={planId} className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {Object.entries(features).map(([featureKey, feature]) => (
                <tr key={featureKey} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {feature.name}
                  </td>
                  {Object.entries(plans).map(([planId, plan]) => {
                    const featureValue = plan.features[featureKey as keyof typeof plan.features];
                    return (
                      <td key={planId} className="px-6 py-4 text-center">
                        {typeof featureValue === 'boolean' ? (
                          featureValue ? (
                            <Check size={16} className="text-green-500 mx-auto" />
                          ) : (
                            <X size={16} className="text-red-500 mx-auto" />
                          )
                        ) : typeof featureValue === 'object' && featureValue !== null ? (
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {featureValue.enabled ? 'Yes' : 'No'}
                            {featureValue.promptLimit > 0 && (
                              <div>({featureValue.promptLimit} prompts)</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {String(featureValue)}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PricingMatrix;
