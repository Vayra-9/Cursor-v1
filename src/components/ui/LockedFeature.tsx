import React from 'react';
import { Lock } from 'lucide-react';
import { usePlan } from '@/contexts/PlanContext';

interface LockedFeatureProps {
  children: React.ReactNode;
  feature: string;
  requiredPlan?: string;
  fallback?: React.ReactNode;
}

const LockedFeature: React.FC<LockedFeatureProps> = ({ 
  children, 
  feature, 
  requiredPlan,
  fallback 
}) => {
  const { canAccess, currentPlan } = usePlan();

  if (canAccess(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-black/20 rounded-lg">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">
              {requiredPlan ? `Upgrade to ${requiredPlan}` : 'Upgrade Required'}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Current plan: {currentPlan}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LockedFeature;
