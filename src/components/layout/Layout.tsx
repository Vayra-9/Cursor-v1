import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  FileText, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  User,
  Plus
} from 'lucide-react';
import { usePlan } from '@/contexts/PlanContext';
import { useI18n } from '@/contexts/I18nContext';
import { PlanType } from '@/types';
import VayraLogo from '@/components/ui/VayraLogo';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import CurrencySelector from '@/components/ui/CurrencySelector';
import LanguageSelector from '@/components/ui/LanguageSelector';
import UserMenu from '@/components/ui/UserMenu';
import NotificationBell from '@/components/ui/NotificationBell';
import SearchBar from '@/components/ui/SearchBar';
import UpgradeBanner from '@/components/ui/UpgradeBanner';
import AICopilot from '@/components/ai/AICopilot';
import OfflineBanner from '@/components/ui/OfflineBanner';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string | number;
  requiresPlan?: PlanType[];
  children?: NavigationItem[];
}

const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { currentPlan } = usePlan();
  const { t } = useI18n();

  const navigation: NavigationItem[] = [
    {
      id: 'dashboard',
      label: t('navigation.dashboard'),
      path: '/dashboard',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'debts',
      label: t('navigation.debts'),
      path: '/debts',
      icon: <CreditCard className="w-5 h-5" />,
      badge: 0, // Fixed: removed user?.debts?.length
    },
    {
      id: 'payments',
      label: t('navigation.payments'),
      path: '/payments',
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      id: 'income',
      label: t('navigation.income'),
      path: '/income',
      icon: <TrendingUp className="w-5 h-5" />,
      requiresPlan: ['starter', 'pro', 'premium'],
    },
    {
      id: 'budget',
      label: t('navigation.budget'),
      path: '/budget',
      icon: <FileText className="w-5 h-5" />,
      requiresPlan: ['starter', 'pro', 'premium'],
    },
    {
      id: 'analytics',
      label: t('navigation.analytics'),
      path: '/analytics',
      icon: <TrendingUp className="w-5 h-5" />,
      requiresPlan: ['pro', 'premium'],
    },
    {
      id: 'calendar',
      label: t('navigation.calendar'),
      path: '/calendar',
      icon: <Calendar className="w-5 h-5" />,
      requiresPlan: ['pro', 'premium'],
    },
    {
      id: 'reports',
      label: t('navigation.reports'),
      path: '/reports',
      icon: <FileText className="w-5 h-5" />,
      requiresPlan: ['pro', 'premium'],
    },
    {
      id: 'education',
      label: t('navigation.education'),
      path: '/education',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'ai-chat',
      label: t('navigation.aiChat'),
      path: '/ai-chat',
      icon: <MessageSquare className="w-5 h-5" />,
      requiresPlan: ['pro', 'premium'],
    },
    {
      id: 'settings',
      label: t('navigation.settings'),
      path: '/settings',
      icon: <Settings className="w-5 h-5" />,
    },
    {
      id: 'profile',
      label: t('navigation.profile'),
      path: '/profile',
      icon: <User className="w-5 h-5" />,
    },
  ];

  const filteredNavigation = navigation.filter(item => {
    if (item.requiresPlan) {
      return item.requiresPlan.includes(currentPlan);
    }
    return true;
  });

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isFeatureLocked = (item: NavigationItem) => {
    return item.requiresPlan && !item.requiresPlan.includes(currentPlan);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" data-testid="layout">
      {/* Offline Banner */}
      <OfflineBanner />
      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-24 px-6 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none" data-testid="logo">
            <VayraLogo className="h-16 md:h-18" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close menu"
          >
            <span aria-label="Close menu"><X className="w-5 h-5" /></span>
          </button>
        </div>

        <nav className="mt-6 px-3" data-testid="nav">
          <div className="space-y-1">
            {filteredNavigation.map((item) => {
              const locked = isFeatureLocked(item);
              return (
                <Link
                  key={item.id}
                  to={locked ? '#' : item.path}
                  onClick={locked ? (e) => e.preventDefault() : undefined}
                  data-testid={`nav-${item.id}`}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                      : locked
                      ? 'text-gray-400 cursor-not-allowed opacity-50'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-100 bg-blue-600 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {locked && (
                    <span className="ml-auto text-xs text-gray-400">
                      {currentPlan === 'free' ? 'Pro' : 'Premium'}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Upgrade Banner */}
        {currentPlan === 'free' && (
          <div className="absolute bottom-4 left-4 right-4">
            <UpgradeBanner />
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700" data-testid="header">
          <div className="flex items-center justify-between h-24 px-4 sm:px-6 lg:px-8">
            {/* Left side */}
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Open menu"
              >
                <span aria-label="Open menu"><Menu className="w-5 h-5" /></span>
              </button>
              
              <div className="ml-4 lg:ml-0">
                <SearchBar />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Quick Actions */}
              <button className="hidden sm:flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
                <Plus className="w-4 h-4 mr-2" />
                {t('common.quickAdd')}
              </button>

              {/* Theme Switcher */}
              <ThemeSwitcher />

              {/* Currency Selector */}
              <CurrencySelector />

              {/* Language Selector */}
              <LanguageSelector />

              {/* Notifications */}
              <NotificationBell />

              {/* User Menu */}
              <UserMenu />
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      {/* AI Copilot */}
      <AICopilot />
    </div>
  );
};

export default Layout; 