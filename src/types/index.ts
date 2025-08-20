export type PlanTier = 'free' | 'starter' | 'pro' | 'premium'

export interface PlanLimits {
  debts: number
  expenses: number
  aiPrompts: number
  incomeStreams: number
  reports: number
  aiChatMessages: number
  storage: number
}

export interface PricingPlan {
  tier: PlanTier
  priceUSD: number
  limits: PlanLimits
  features: string[]
}

// User and Authentication Types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt: Date;
  isGrandfathered?: boolean;
  grandfatheredDate?: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  language: string;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  paymentReminders: boolean;
  milestoneAlerts: boolean;
  tipsAndMotivation: boolean;
}

export interface PrivacySettings {
  shareProgress: boolean;
  shareTestimonials: boolean;
  analytics: boolean;
}

// Subscription and Plan Types
export type PlanType = 'free' | 'starter' | 'pro' | 'premium';

export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: PlanFeature[];
  limits: PlanLimits;
  isPopular?: boolean;
  isGrandfathered?: boolean;
}

export interface PlanFeature {
  id: string;
  name: string;
  description: string;
  included: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: PlanType;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
}

// Debt Management Types
export interface Debt {
  id: string;
  userId: string;
  name: string;
  type: DebtType;
  balance: number;
  originalBalance: number;
  interestRate: number;
  minimumPayment: number;
  dueDate: number; // Day of month
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type DebtType = 
  | 'credit_card'
  | 'personal_loan'
  | 'student_loan'
  | 'mortgage'
  | 'auto_loan'
  | 'medical'
  | 'business'
  | 'other';

export interface Payment {
  id: string;
  debtId: string;
  userId: string;
  amount: number;
  date: Date;
  type: 'minimum' | 'extra' | 'full';
  notes?: string;
  receipt?: string; // URL to receipt image
  createdAt: Date;
}

export interface PayoffStrategy {
  id: string;
  userId: string;
  name: string;
  type: 'snowball' | 'avalanche' | 'custom';
  debts: string[]; // Debt IDs in order
  monthlyPayment: number;
  estimatedPayoffDate: Date;
  totalInterest: number;
  createdAt: Date;
  updatedAt: Date;
}

// Income and Skills Types
export interface IncomeStream {
  id: string;
  userId: string;
  name: string;
  type: IncomeType;
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IncomeType = 
  | 'salary'
  | 'freelance'
  | 'business'
  | 'investment'
  | 'rental'
  | 'side_hustle'
  | 'passive'
  | 'other';

export interface Skill {
  id: string;
  userId: string;
  name: string;
  category: SkillCategory;
  proficiency: 1 | 2 | 3 | 4 | 5;
  isMonetizable: boolean;
  estimatedHourlyRate?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SkillCategory = 
  | 'technical'
  | 'creative'
  | 'business'
  | 'service'
  | 'trade'
  | 'language'
  | 'other';

// Analytics and Reports Types
export interface DebtAnalytics {
  totalDebt: number;
  totalInterest: number;
  averageInterestRate: number;
  debtFreeDate: Date;
  monthlyPayment: number;
  progressPercentage: number;
  debtBreakdown: DebtBreakdown[];
  monthlyProgress: MonthlyProgress[];
}

export interface DebtBreakdown {
  type: DebtType;
  total: number;
  percentage: number;
  count: number;
}

export interface MonthlyProgress {
  month: string;
  totalDebt: number;
  payments: number;
  interest: number;
}

export interface DTIResult {
  grossIncome: number;
  totalDebtPayments: number;
  dtiRatio: number;
  category: 'excellent' | 'good' | 'fair' | 'poor';
  recommendations: string[];
}

// AI and Chat Types
export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: {
    debtId?: string;
    incomeId?: string;
    module?: string;
  };
}

export interface AIContext {
  userDebts: Debt[];
  userIncome: IncomeStream[];
  userPlan: PlanType;
  userGoals: string[];
  recentActivity: string[];
}

// Calendar and Reminders Types
export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  type: 'payment' | 'milestone' | 'reminder' | 'goal';
  date: Date;
  amount?: number;
  debtId?: string;
  isCompleted: boolean;
  notes?: string;
  createdAt: Date;
}

export interface SmartTask {
  id: string;
  userId: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  nextDue: Date;
  isCompleted: boolean;
  category: 'budgeting' | 'debt' | 'income' | 'investment' | 'general';
  createdAt: Date;
}

// Education and Content Types
export interface EducationModule {
  id: string;
  title: string;
  description: string;
  content: string;
  duration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  isFree: boolean;
  order: number;
  createdAt: Date;
}

export interface Tip {
  id: string;
  title: string;
  content: string;
  category: 'debt' | 'income' | 'mindset' | 'budgeting';
  source?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface MotivationalQuote {
  id: string;
  quote: string;
  author: string;
  category: 'debt' | 'success' | 'perseverance' | 'mindset';
  isActive: boolean;
  createdAt: Date;
}

// Review and Testimonial Types
export interface Review {
  id: string;
  userId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  content: string;
  location: string;
  isVerified: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Referral and Gamification Types
export interface Referral {
  id: string;
  referrerId: string;
  referredEmail: string;
  status: 'pending' | 'completed' | 'expired';
  rewardAmount: number;
  rewardType: 'credit' | 'subscription_days';
  createdAt: Date;
  completedAt?: Date;
}

export interface Achievement {
  id: string;
  userId: string;
  type: AchievementType;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export type AchievementType = 
  | 'first_payment'
  | 'debt_free'
  | 'streak_7'
  | 'streak_30'
  | 'streak_100'
  | 'referral_5'
  | 'referral_10'
  | 'income_stream_3'
  | 'skill_mastered'
  | 'budget_perfect';

// Currency and Internationalization Types
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Exchange rate to USD
  lastUpdated: Date;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  isRTL: boolean;
}

// Export and Report Types
export interface Report {
  id: string;
  userId: string;
  type: 'debt_summary' | 'income_analysis' | 'dti_report' | 'payoff_plan';
  format: 'pdf' | 'csv' | 'json';
  data: any;
  generatedAt: Date;
  expiresAt: Date;
}

// Budget Types
export interface Budget {
  id: string;
  userId: string;
  name: string;
  type: 'emergency' | 'monthly' | 'debt_payoff' | 'income_growth';
  categories: BudgetCategory[];
  totalAmount: number;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  color: string;
}

// Expense Types
export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  paymentMethod?: string;
  debtId?: string;
  receipt?: string;
  createdAt: Date;
}

// Import and Export Types
export interface ImportResult {
  success: boolean;
  imported: number;
  errors: ImportError[];
  summary: string;
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
  value?: any;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  badge?: string | number;
  children?: NavigationItem[];
  requiresAuth?: boolean;
  requiresPlan?: PlanType[];
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
} 