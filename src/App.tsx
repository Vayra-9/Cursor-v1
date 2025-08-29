import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { AIProvider } from '@/contexts/AIContext';
import { debugFirebaseConfig } from '@/lib/firebase-debug';
import { testFirebaseAuth } from '@/lib/auth-test';

// Layout Components
import Layout from '@/components/layout/Layout';
import AuthLayout from '@/components/layout/AuthLayout';

// Public Pages
import LandingPage from '@/pages/LandingPage';
import AboutPage from '@/pages/public/AboutPage';
import ContactPage from '@/pages/ContactPage';
import PricingPage from '@/pages/PricingPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';

// Auth Pages
import SignInPage from '@/pages/auth/SignInPage';
import SignUpPage from '@/pages/auth/SignUpPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';

// Protected Pages
import DashboardPage from '@/pages/dashboard/DashboardPage';
import DebtsPage from '@/pages/DebtsPage';
import PaymentsPage from '@/pages/payments/PaymentsPage';
import IncomePage from '@/pages/income/IncomePage';
import BudgetPage from '@/pages/budget/BudgetPage';
import AnalyticsPage from '@/pages/analytics/AnalyticsPage';
import CalendarPage from '@/pages/calendar/CalendarPage';
import ReportsPage from '@/pages/reports/ReportsPage';
import EducationPage from '@/pages/education/EducationPage';
import AIChatPage from '@/pages/ai/AIChatPage';
import SettingsPage from '@/pages/settings/SettingsPage';
import ProfilePage from '@/pages/ProfilePage';

// Plan Guard and Upgrade Page
import RequirePlan from '@/components/auth/RequirePlan';
import Upgrade from '@/pages/Upgrade';

// Error Pages
import NotFoundPage from '@/pages/errors/NotFoundPage';
import ErrorPage from '@/pages/errors/ErrorPage';
import DevError from '@/pages/DevError';

// Dev Pages
import DevSeed from '@/dev/DevSeed';

// Components
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirects to dashboard if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const { ready } = useI18n();

  // Debug Firebase configuration on app start
  useEffect(() => {
    debugFirebaseConfig();
    // Test Firebase auth functionality
    testFirebaseAuth();
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      <Helmet>
        <title>VAYRA - Debt Management & Income Platform</title>
        <meta name="description" content="Transform your financial life with AI-powered debt management and income generation strategies." />
        <meta name="keywords" content="debt management, financial planning, income generation, budgeting, debt payoff, financial freedom" />
        <meta name="author" content="VAYRA Team" />
        
        {/* Open Graph */}
        <meta property="og:title" content="VAYRA - Debt Management & Income Platform" />
        <meta property="og:description" content="Transform your financial life with AI-powered debt management and income generation strategies." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vayra.app" />
        <meta property="og:image" content="/og-image.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="VAYRA - Debt Management & Income Platform" />
        <meta name="twitter:description" content="Transform your financial life with AI-powered debt management and income generation strategies." />
        <meta name="twitter:image" content="/og-image.png" />
        
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        
        {/* Theme */}
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="color-scheme" content="light dark" />
      </Helmet>

      <AIProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<ErrorBoundary><LandingPage /></ErrorBoundary>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Auth Routes */}
          <Route path="/signin" element={
            <PublicRoute>
              <AuthLayout>
                <SignInPage />
              </AuthLayout>
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <AuthLayout>
                <SignUpPage />
              </AuthLayout>
            </PublicRoute>
          } />
          {/* Auth Routes with correct casing for TestSprite */}
          <Route path="/auth/sign-in" element={
            <PublicRoute>
              <AuthLayout>
                <SignInPage />
              </AuthLayout>
            </PublicRoute>
          } />
          <Route path="/auth/sign-up" element={
            <PublicRoute>
              <AuthLayout>
                <SignUpPage />
              </AuthLayout>
            </PublicRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicRoute>
              <AuthLayout>
                <ForgotPasswordPage />
              </AuthLayout>
            </PublicRoute>
          } />
          <Route path="/auth/forgot-password" element={
            <PublicRoute>
              <AuthLayout>
                <ForgotPasswordPage />
              </AuthLayout>
            </PublicRoute>
          } />
          <Route path="/reset-password" element={
            <PublicRoute>
              <AuthLayout>
                <ResetPasswordPage />
              </AuthLayout>
            </PublicRoute>
          } />

          {/* Dashboard Route - Allow free users to access basic dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <RequirePlan min="free">
                <Layout />
              </RequirePlan>
            </ProtectedRoute>
          }>
            <Route index element={<DashboardPage />} />
          </Route>

          {/* Upgrade Route */}
          <Route path="/upgrade" element={
            <ProtectedRoute>
              <Upgrade />
            </ProtectedRoute>
          } />

          {/* AI Chat Route */}
          <Route path="/ai/chat" element={
            <ProtectedRoute>
              <AIChatPage />
            </ProtectedRoute>
          } />

          {/* Protected Routes with Layout */}
          <Route path="/app" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={
              <RequirePlan min="free">
                <DashboardPage />
              </RequirePlan>
            } />
            <Route path="debts" element={<DebtsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="income" element={<IncomePage />} />
            <Route path="budget" element={<BudgetPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="education" element={<EducationPage />} />
            <Route path="ai-chat" element={<AIChatPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Dev Routes */}
          {import.meta.env.DEV && (
            <>
              <Route path="/dev-seed" element={<DevSeed />} />
              <Route path="/dev/error" element={<ErrorBoundary><DevError /></ErrorBoundary>} />
            </>
          )}

          {/* Error Routes */}
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AIProvider>
    </>
  );
};

export default App; 