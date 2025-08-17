import React, { createContext, useContext, useEffect, useState } from 'react';
import { Currency } from '@/types';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  currencies: Currency[];
  exchangeRates: { [key: string]: number };
  convertAmount: (amount: number, fromCurrency: string, toCurrency: string) => number;
  formatCurrency: (amount: number, currencyCode?: string) => string;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: React.ReactNode;
}

const DEFAULT_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1, lastUpdated: new Date() },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85, lastUpdated: new Date() },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.73, lastUpdated: new Date() },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.25, lastUpdated: new Date() },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.35, lastUpdated: new Date() },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 110, lastUpdated: new Date() },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.92, lastUpdated: new Date() },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 6.45, lastUpdated: new Date() },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 74.5, lastUpdated: new Date() },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 5.2, lastUpdated: new Date() },
];

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currency, setCurrencyState] = useState<string>(() => {
    const saved = localStorage.getItem('vayra-currency');
    return saved || 'USD';
  });

  const [currencies, setCurrencies] = useState<Currency[]>(DEFAULT_CURRENCIES);
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  // Fetch exchange rates from API
  const fetchExchangeRates = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would use a proper exchange rate API
      // For now, we'll use mock data that updates periodically
      const mockRates: { [key: string]: number } = {
        USD: 1,
        EUR: 0.85 + (Math.random() - 0.5) * 0.1,
        GBP: 0.73 + (Math.random() - 0.5) * 0.1,
        CAD: 1.25 + (Math.random() - 0.5) * 0.1,
        AUD: 1.35 + (Math.random() - 0.5) * 0.1,
        JPY: 110 + (Math.random() - 0.5) * 10,
        CHF: 0.92 + (Math.random() - 0.5) * 0.1,
        CNY: 6.45 + (Math.random() - 0.5) * 0.5,
        INR: 74.5 + (Math.random() - 0.5) * 5,
        BRL: 5.2 + (Math.random() - 0.5) * 0.5,
      };

      setExchangeRates(mockRates);

      // Update currencies with new rates
      setCurrencies(prev => prev.map(curr => ({
        ...curr,
        rate: mockRates[curr.code] || curr.rate,
        lastUpdated: new Date(),
      })));

    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates();

    // Update rates every hour
    const interval = setInterval(fetchExchangeRates, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('vayra-currency', currency);
  }, [currency]);

  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
  };

  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    
    const fromRate = exchangeRates[fromCurrency] || 1;
    const toRate = exchangeRates[toCurrency] || 1;
    
    // Convert to USD first, then to target currency
    const usdAmount = amount / fromRate;
    return usdAmount * toRate;
  };

  const formatCurrency = (amount: number, currencyCode?: string): string => {
    const code = currencyCode || currency;
    const currencyInfo = currencies.find(c => c.code === code);
    
    if (!currencyInfo) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
      }).format(amount);
    }

    // Custom formatting for better UX
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

    return formatter.format(amount);
  };

  const value: CurrencyContextType = {
    currency,
    setCurrency,
    currencies,
    exchangeRates,
    convertAmount,
    formatCurrency,
    loading,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}; 