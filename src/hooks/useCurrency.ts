import { useState, useEffect } from 'react';

export type Currency = {
  code: string;
  name: string;
  symbol: string;
};

const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
];

export const useCurrency = () => {
  const [currency, setCurrencyState] = useState<string>(() => {
    const saved = localStorage.getItem('vayra-local-currency');
    return saved || 'USD';
  });

  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('vayra-local-currency', newCurrency);
  };

  const currentCurrency = SUPPORTED_CURRENCIES.find(c => c.code === currency) || SUPPORTED_CURRENCIES[0];

  return {
    currency,
    setCurrency,
    currencies: SUPPORTED_CURRENCIES,
    currentCurrency,
  };
};
