import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { usePlan } from '@/contexts/PlanContext';
import { useI18n } from '@/contexts/I18nContext';
import { cn } from '@/utils/cn';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();
  const { canAccess } = usePlan();
  const { t } = useI18n();

  const navigation = [
    {
      name: t('navigation.dashboard'),
      href: '/dashboard',
      icon: 'LayoutDashboard',
      requiresAuth: true,
    },
    {
      name: t('navigation.debts'),
      href: '/debts',
      icon: 'CreditCard',
      requiresAuth: true,
      requiresPlan: ['free', 'starter', 'pro', 'premium'],
    },
    {
      name: t('navigation.payments'),
      href: '/payments',
      icon: 'DollarSign',
      requiresAuth: true,
      requiresPlan: ['free', 'starter', 'pro', 'premium'],
    },
    {
      name: t('navigation.income'),
      href: '/income',
      icon: 'TrendingUp',
      requiresAuth: true,
      requiresPlan: ['free', 'starter', 'pro', 'premium'],
    },
    {
      name: t('navigation.budget'),
      href: '/budget',
      icon: 'PieChart',
      requiresAuth: true,
      requiresPlan: ['starter', 'pro', 'premium'],
    },
    {
      name: t('navigation.analytics'),
      href: '/analytics',
      icon: 'BarChart3',
      requiresAuth: true,
      requiresPlan: ['starter', 'pro', 'premium'],
    },
    {
      name: t('navigation.calendar'),
      href: '/calendar',
      icon: 'Calendar',
      requiresAuth: true,
      requiresPlan: ['pro', 'premium'],
    },
    {
      name: t('navigation.reports'),
      href: '/reports',
      icon: 'FileText',
      requiresAuth: true,
      requiresPlan: ['pro', 'premium'],
    },
    {
      name: t('navigation.education'),
      href: '/education',
      icon: 'BookOpen',
      requiresAuth: true,
      requiresPlan: ['free', 'starter', 'pro', 'premium'],
    },
    {
      name: t('ai.title'),
      href: '/ai-chat',
      icon: 'MessageSquare',
      requiresAuth: true,
      requiresPlan: ['free', 'starter', 'pro', 'premium'],
    },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const canAccessItem = (item: any) => {
    if (!item.requiresAuth) return true;
    if (item.requiresPlan && !item.requiresPlan.includes('free')) {
      return canAccess(item.requiresPlan[0]);
    }
    return true;
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-800">
      {/* Sidebar header */}
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
            <span className="text-sm font-bold text-white">V</span>
          </div>
          <span className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
            VAYRA
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            className="lg:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300"
            onClick={onClose}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          if (!canAccessItem(item)) return null;

          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive(item.href)
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              )}
              onClick={onClose}
            >
              <div className="mr-3 h-5 w-5">
                {/* Icon placeholder - you can replace with actual icons */}
                <div className="h-5 w-5 rounded bg-current opacity-60" />
              </div>
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>© 2024 VAYRA</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 