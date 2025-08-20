import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequirePlanProps {
  children: React.ReactNode;
  min: 'free' | 'starter' | 'pro' | 'enterprise';
  redirectTo?: string;
}

const planLevels = {
  free: 0,
  starter: 1,
  pro: 2,
  enterprise: 3
};

export const RequirePlan: React.FC<RequirePlanProps> = ({ 
  children, 
  min, 
  redirectTo = '/upgrade' 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Check if user has the required plan level
  const userPlanLevel = planLevels[user.preferences?.plan || 'free'];
  const requiredLevel = planLevels[min];

  if (userPlanLevel < requiredLevel) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
