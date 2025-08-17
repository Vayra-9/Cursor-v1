import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils/cn';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'system', icon: Monitor, label: 'System' },
  ] as const;

  return (
    <div className="relative">
      <div className="flex items-center space-x-1 rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
        {themes.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTheme(id)}
            className={cn(
              'flex items-center justify-center rounded-md px-2 py-1.5 text-sm font-medium transition-colors',
              theme === id
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            )}
            title={`Switch to ${label} theme`}
          >
            <Icon className="h-4 w-4" />
            <span className="sr-only">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeToggle; 