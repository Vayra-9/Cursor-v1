import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { watchUserPlan } from '@/services/plan';
import { Plan, PlanType, Subscription } from '@/types';
import type { PlanTier } from '@/types/db';
import pricingData from '@/data/pricing.json';

interface PlanContextType {
  user: User | null;
  currentPlan: PlanType;
  tier: PlanTier;
  grandfathered?: boolean;
  subscription: Subscription | null;
  plans: Plan[];
  isLoading: boolean;
  loading: boolean;
  canAccess: (feature: string) => boolean;
  isFeatureAvailable: (feature: string, planType: PlanType) => boolean;
  upgradePlan: (planId: PlanType) => Promise<void>;
  downgradePlan: (planId: PlanType) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  reactivateSubscription: () => Promise<void>;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};

interface PlanProviderProps {
  children: React.ReactNode;
}

// Convert pricing.json to Plan[] format
const getPlansFromPricing = (): Plan[] => {
  return Object.entries(pricingData.plans).map(([planId, planData]) => {
    const features = Object.entries(planData.features).map(([featureKey, enabled]) => {
      const feature = pricingData.features[featureKey as keyof typeof pricingData.features];
      return {
        id: featureKey,
        name: feature?.name || featureKey,
        description: feature?.description || '',
        included: typeof enabled === 'boolean' ? enabled : (enabled as any)?.enabled || false
      };
    });

          return {
        id: planId as PlanType,
        name: planData.name,
        price: planData.price,
        currency: planData.currency,
        interval: planData.billingCycle as 'monthly' | 'yearly',
        isPopular: planData.popular,
      features,
      limits: {
        debts: planData.limits.maxDebts,
        expenses: planData.limits.maxPayments,
        aiPrompts: planData.features.aiCopilot?.promptLimit || 0,
        incomeStreams: -1, // Not in pricing.json yet
        reports: -1, // Not in pricing.json yet
        aiChatMessages: planData.features.aiCopilot?.promptLimit || 0,
        storage: parseInt(planData.limits.storageLimit.replace('MB', '').replace('GB', '000')),
      },
    };
  });
};

const DEFAULT_PLANS = getPlansFromPricing();

export const PlanProvider: React.FC<PlanProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPlan, setCurrentPlan] = useState<PlanType>('free');
  const [tier, setTier] = useState<PlanTier>('free');
  const [grandfathered, setGF] = useState<boolean | undefined>(undefined);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  // Firebase auth integration
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, u => {
      setUser(u);
      if (!u) { 
        setCurrentPlan('free'); 
        setTier('free');
        setGF(undefined); 
        setLoading(false); 
        return; 
      }
      const unsubPlan = watchUserPlan(u.uid, p => { 
        setTier(p.tier); 
        setCurrentPlan(p.tier as PlanType);
        setGF(p.grandfathered); 
        setLoading(false); 
      });
      return () => unsubPlan();
    });
    return () => unsubAuth();
  }, []);

  // Mock subscription data - in a real app, this would come from your backend
  useEffect(() => {
    const loadSubscription = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock subscription data
        const mockSubscription: Subscription = {
          id: 'sub_123',
          userId: 'user_123',
          planId: 'free',
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          cancelAtPeriodEnd: false,
        };
        
        setSubscription(mockSubscription);
        setCurrentPlan(mockSubscription.planId);
      } catch (error) {
        console.error('Failed to load subscription:', error);
        setCurrentPlan('free');
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscription();
  }, []);

  const canAccess = (feature: string): boolean => {
    const plan = DEFAULT_PLANS.find(p => p.id === currentPlan);
    if (!plan) return false;

    const featureConfig = plan.features.find(f => f.id === feature);
    return featureConfig?.included || false;
  };

  const isFeatureAvailable = (feature: string, planType: PlanType): boolean => {
    const plan = DEFAULT_PLANS.find(p => p.id === planType);
    if (!plan) return false;

    const featureConfig = plan.features.find(f => f.id === feature);
    return featureConfig?.included || false;
  };

  const upgradePlan = async (planId: PlanType): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update subscription
      const updatedSubscription: Subscription = {
        ...subscription!,
        planId,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };
      
      setSubscription(updatedSubscription);
      setCurrentPlan(planId);
      
      // In a real app, you would redirect to Stripe checkout or handle payment
      console.log(`Upgrading to ${planId} plan`);
    } catch (error) {
      console.error('Failed to upgrade plan:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const downgradePlan = async (planId: PlanType): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update subscription
      const updatedSubscription: Subscription = {
        ...subscription!,
        planId,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };
      
      setSubscription(updatedSubscription);
      setCurrentPlan(planId);
      
      console.log(`Downgrading to ${planId} plan`);
    } catch (error) {
      console.error('Failed to downgrade plan:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update subscription
      const updatedSubscription: Subscription = {
        ...subscription!,
        status: 'canceled',
        cancelAtPeriodEnd: true,
      };
      
      setSubscription(updatedSubscription);
      
      console.log('Subscription cancelled');
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const reactivateSubscription = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update subscription
      const updatedSubscription: Subscription = {
        ...subscription!,
        status: 'active',
        cancelAtPeriodEnd: false,
      };
      
      setSubscription(updatedSubscription);
      
      console.log('Subscription reactivated');
    } catch (error) {
      console.error('Failed to reactivate subscription:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: PlanContextType = {
    user,
    currentPlan,
    tier,
    grandfathered,
    subscription,
    plans: DEFAULT_PLANS,
    isLoading,
    loading,
    canAccess,
    isFeatureAvailable,
    upgradePlan,
    downgradePlan,
    cancelSubscription,
    reactivateSubscription,
  };

  return (
    <PlanContext.Provider value={value}>
      {children}
    </PlanContext.Provider>
  );
}; 