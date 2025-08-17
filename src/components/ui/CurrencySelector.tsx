import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { cn } from '@/utils/cn';

const CurrencySelector: React.FC = () => {
  const { currency, setCurrency, currencies } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const currentCurrency = currencies.find(c => c.code === currency);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <span>{currentCurrency?.symbol || '$'}</span>
        <span className="hidden sm:block">{currentCurrency?.code || 'USD'}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            {currencies.map((curr) => (
              <button
                key={curr.code}
                onClick={() => {
                  setCurrency(curr.code);
                  setIsOpen(false);
                }}
                className={cn(
                  'flex w-full items-center px-4 py-2 text-sm',
                  currency === curr.code
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                <span className="mr-2">{curr.symbol}</span>
                <span className="flex-1 text-left">{curr.name}</span>
                {currency === curr.code && (
                  <Check className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector; 