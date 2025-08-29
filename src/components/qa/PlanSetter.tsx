import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Crown, Star, Zap, User } from 'lucide-react';

const PlanSetter: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const plans = [
    { id: 'free', name: 'Free', icon: User, color: 'bg-gray-500' },
    { id: 'starter', name: 'Starter', icon: Star, color: 'bg-blue-500' },
    { id: 'pro', name: 'Pro', icon: Zap, color: 'bg-purple-500' },
    { id: 'premium', name: 'Premium', icon: Crown, color: 'bg-yellow-500' },
  ];

  const setPlan = async (planId: string) => {
    if (!auth.currentUser) {
      alert('No user signed in');
      return;
    }

    setLoading(planId);
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        'preferences.plan': planId
      });
      alert(`Plan set to ${planId}! Refresh the page to see changes.`);
    } catch (error) {
      console.error('Error setting plan:', error);
      alert('Failed to set plan. Check console for details.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
        QA: Set Plan
      </div>
      <div className="flex gap-2">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <button
              key={plan.id}
              onClick={() => setPlan(plan.id)}
              disabled={loading === plan.id}
              className={`p-2 rounded-md transition-all duration-200 ${
                loading === plan.id
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              data-testid={`qa-set-plan-${plan.id}`}
              title={`Set plan to ${plan.name}`}
            >
              <Icon className={`w-4 h-4 ${plan.color} text-white rounded`} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PlanSetter;
