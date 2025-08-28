import React, { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { motion, AnimatePresence } from 'framer-motion';

const CurrencySelector: React.FC = () => {
  const { currency, setCurrency, currencies, currentCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
        aria-label="Change currency"
      >
        <span aria-label="Change currency"><Globe className="w-4 h-4" /></span>
        <span>{currentCurrency?.symbol || '$'}</span>
        <span className="hidden sm:inline">{currentCurrency?.code || 'USD'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="py-1">
              {currencies.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => {
                    setCurrency(curr.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                    currency === curr.code
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{curr.symbol}</span>
                    <span>{curr.code}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {curr.name}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default CurrencySelector; 