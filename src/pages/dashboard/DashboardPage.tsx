import React from 'react'
import { usePlan } from '@/contexts/PlanContext'
import { pricing } from '@/data/pricing'
import LockedFeature from '@/components/ui/LockedFeature'

export default function DashboardPage() {
  const { tier, grandfathered } = usePlan()

  const planFeatures = pricing[tier]?.features || []
  const planLimits = pricing[tier]?.limits || {}

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome to your VAYRA dashboard
        </p>
      </div>

      {/* Plan Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Plan: {tier.toUpperCase()}</h2>
        {grandfathered && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 mb-4">
            <span className="text-yellow-800 dark:text-yellow-200 font-medium">
              🏆 Grandfathered Plan
            </span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(planLimits).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-2xl font-bold text-blue-600">{value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Debt Dashboard */}
        <LockedFeature feature="debts" requiredPlan="Starter">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">Debt Dashboard</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Overview of all debts, progress meters, quick stats
            </p>
            <div className="text-xs text-green-600">✅ Available</div>
          </div>
        </LockedFeature>

        {/* Payment Tracker */}
        <LockedFeature feature="payment_tracker" requiredPlan="Starter">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">Payment Tracker</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Track and log payments with history & receipts
            </p>
            <div className="text-xs text-green-600">✅ Available</div>
          </div>
        </LockedFeature>

        {/* Payoff Strategy */}
        <LockedFeature feature="payoff_strategy" requiredPlan="Pro">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">Payoff Strategy</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Snowball & Avalanche calculators with visual timelines
            </p>
            <div className="text-xs text-green-600">✅ Available</div>
          </div>
        </LockedFeature>

        {/* DTI Calculator */}
        <LockedFeature feature="dti_calculator" requiredPlan="Starter">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">DTI Calculator</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Debt-to-Income ratio calculator with recommendations
            </p>
            <div className="text-xs text-green-600">✅ Available</div>
          </div>
        </LockedFeature>

        {/* Advanced Analytics */}
        <LockedFeature feature="advanced_analytics" requiredPlan="Pro">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Debt-free date predictions, charts, and insights
            </p>
            <div className="text-xs text-green-600">✅ Available</div>
          </div>
        </LockedFeature>

        {/* AI Money Coach */}
        <LockedFeature feature="ai_chat" requiredPlan="Pro">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">AI Money Coach</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              AI-powered assistant for debt advice
            </p>
            <div className="text-xs text-green-600">✅ Available</div>
          </div>
        </LockedFeature>
      </div>

      {/* Upgrade Banner for Free Users */}
      {tier === 'free' && (
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h3 className="text-xl font-semibold mb-2">Unlock Full VAYRA Experience</h3>
          <p className="mb-4 opacity-90">
            Upgrade to Pro or Premium to access all 28 core modules and advanced features.
          </p>
          <button className="bg-white text-blue-600 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors">
            View Plans
          </button>
        </div>
      )}
    </div>
  )
} 