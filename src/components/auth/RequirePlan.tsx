import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface RequirePlanProps {
  min?: 'free' | 'starter' | 'pro' | 'premium';
  children: React.ReactNode;
}

const RequirePlan: React.FC<RequirePlanProps> = ({ min = 'free', children }) => {
  const { user, loading } = useAuth();

  // Show loading spinner while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to sign-in if no user
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Define plan hierarchy
  const planOrder = ['free', 'starter', 'pro', 'premium'] as const;
  const userPlan = user.preferences?.plan || 'free';
  
  // Get plan ranks
  const userPlanRank = planOrder.indexOf(userPlan as any);
  const minPlanRank = planOrder.indexOf(min);

  // Redirect to upgrade if user's plan rank is less than required
  if (userPlanRank < minPlanRank) {
    return <Navigate to="/upgrade" replace />;
  }

  // User has sufficient plan level, render children
  return <>{children}</>;
};

export default RequirePlan;
