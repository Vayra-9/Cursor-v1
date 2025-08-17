// Basic i18n utilities for VAYRA
// This provides a foundation for future multilingual expansion

export interface TranslationKeys {
  // Common UI elements
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    add: string;
    close: string;
    submit: string;
    back: string;
    next: string;
    previous: string;
    search: string;
    filter: string;
    sort: string;
    refresh: string;
    settings: string;
    profile: string;
    logout: string;
  };

  // Navigation
  navigation: {
    home: string;
    dashboard: string;
    pricing: string;
    login: string;
    signup: string;
    about: string;
    contact: string;
    help: string;
    privacy: string;
    terms: string;
  };

  // Dashboard
  dashboard: {
    title: string;
    subtitle: string;
    debtOverview: string;
    paymentTracker: string;
    analytics: string;
    payoffStrategy: string;
    aiCoach: string;
    settings: string;
  };

  // AI Copilot
  ai: {
    title: string;
    subtitle: string;
    welcome: string;
    placeholder: string;
    send: string;
    thinking: string;
    error: string;
    limitReached: string;
    upgradePrompt: string;
    suggestedQuestions: string;
  };

  // Plans
  plans: {
    free: string;
    starter: string;
    pro: string;
    premium: string;
    upgrade: string;
    current: string;
    features: string;
    price: string;
    perMonth: string;
    perYear: string;
    save: string;
    popular: string;
    bestValue: string;
  };

  // Debt Management
  debt: {
    title: string;
    addDebt: string;
    editDebt: string;
    deleteDebt: string;
    debtName: string;
    balance: string;
    interestRate: string;
    minimumPayment: string;
    dueDate: string;
    category: string;
    totalDebt: string;
    monthlyPayments: string;
    payoffDate: string;
    interestPaid: string;
  };

  // Analytics
  analytics: {
    title: string;
    dtiRatio: string;
    debtFreeDate: string;
    interestSavings: string;
    monthlyPayment: string;
    debtBreakdown: string;
    paymentHistory: string;
    trends: string;
    projections: string;
  };
}

// Default English translations
export const enTranslations: TranslationKeys = {
  common: {
    loading: "Loading...",
    error: "An error occurred",
    success: "Success!",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    close: "Close",
    submit: "Submit",
    back: "Back",
    next: "Next",
    previous: "Previous",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    refresh: "Refresh",
    settings: "Settings",
    profile: "Profile",
    logout: "Logout"
  },
  navigation: {
    home: "Home",
    dashboard: "Dashboard",
    pricing: "Pricing",
    login: "Login",
    signup: "Sign Up",
    about: "About",
    contact: "Contact",
    help: "Help",
    privacy: "Privacy",
    terms: "Terms"
  },
  dashboard: {
    title: "Dashboard",
    subtitle: "Your financial overview",
    debtOverview: "Debt Overview",
    paymentTracker: "Payment Tracker",
    analytics: "Analytics",
    payoffStrategy: "Payoff Strategy",
    aiCoach: "AI Coach",
    settings: "Settings"
  },
  ai: {
    title: "VAYRA AI",
    subtitle: "Your financial assistant",
    welcome: "Hello! I'm your VAYRA AI assistant. I can help you with debt planning, budgeting advice, and payoff strategies.",
    placeholder: "Ask me anything about debt, budgeting, or financial planning...",
    send: "Send",
    thinking: "Thinking...",
    error: "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.",
    limitReached: "You've reached your plan limit. Upgrade to Pro for unlimited AI assistance.",
    upgradePrompt: "Upgrade to Pro for more questions",
    suggestedQuestions: "Suggested questions:"
  },
  plans: {
    free: "Free",
    starter: "Starter",
    pro: "Pro",
    premium: "Premium",
    upgrade: "Upgrade",
    current: "Current Plan",
    features: "Features",
    price: "Price",
    perMonth: "/month",
    perYear: "/year",
    save: "Save",
    popular: "Most Popular",
    bestValue: "Best Value"
  },
  debt: {
    title: "Debt Management",
    addDebt: "Add Debt",
    editDebt: "Edit Debt",
    deleteDebt: "Delete Debt",
    debtName: "Debt Name",
    balance: "Balance",
    interestRate: "Interest Rate",
    minimumPayment: "Minimum Payment",
    dueDate: "Due Date",
    category: "Category",
    totalDebt: "Total Debt",
    monthlyPayments: "Monthly Payments",
    payoffDate: "Payoff Date",
    interestPaid: "Interest Paid"
  },
  analytics: {
    title: "Analytics",
    dtiRatio: "DTI Ratio",
    debtFreeDate: "Debt-Free Date",
    interestSavings: "Interest Savings",
    monthlyPayment: "Monthly Payment",
    debtBreakdown: "Debt Breakdown",
    paymentHistory: "Payment History",
    trends: "Trends",
    projections: "Projections"
  }
};

// Language configuration
export const supportedLanguages = {
  en: {
    name: "English",
    code: "en",
    flag: "🇺🇸"
  },
  es: {
    name: "Español",
    code: "es",
    flag: "🇪🇸"
  },
  fr: {
    name: "Français",
    code: "fr",
    flag: "🇫🇷"
  },
  de: {
    name: "Deutsch",
    code: "de",
    flag: "🇩🇪"
  },
  zh: {
    name: "中文",
    code: "zh",
    flag: "🇨🇳"
  }
};

// i18n utility functions
export class I18nService {
  private currentLanguage: string = 'en';
  private translations: Record<string, TranslationKeys> = {
    en: enTranslations
  };

  constructor() {
    // Load language from localStorage or browser preference
    const savedLanguage = localStorage.getItem('vayra-language');
    const browserLanguage = navigator.language.split('-')[0];
    
    this.currentLanguage = savedLanguage || 
      (Object.keys(supportedLanguages).includes(browserLanguage) ? browserLanguage : 'en');
  }

  setLanguage(language: string) {
    if (Object.keys(supportedLanguages).includes(language)) {
      this.currentLanguage = language;
      localStorage.setItem('vayra-language', language);
    }
  }

  getLanguage(): string {
    return this.currentLanguage;
  }

  t(key: string): string {
    const keys = key.split('.');
    let value: any = this.translations[this.currentLanguage] || this.translations.en;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English
        value = this.translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if translation not found
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  }

  // Format currency based on locale
  formatCurrency(amount: number, currency: string = 'USD'): string {
    const locale = this.currentLanguage === 'en' ? 'en-US' : this.currentLanguage;
    
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
      }).format(amount);
    } catch {
      // Fallback to USD formatting
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    }
  }

  // Format date based on locale
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    const locale = this.currentLanguage === 'en' ? 'en-US' : this.currentLanguage;
    
    try {
      return new Intl.DateTimeFormat(locale, options).format(date);
    } catch {
      // Fallback to US formatting
      return new Intl.DateTimeFormat('en-US', options).format(date);
    }
  }

  // Get supported languages
  getSupportedLanguages() {
    return supportedLanguages;
  }
}

// Create singleton instance
export const i18n = new I18nService();

// Hook for React components
export const useTranslation = () => {
  return {
    t: i18n.t.bind(i18n),
    language: i18n.getLanguage(),
    setLanguage: i18n.setLanguage.bind(i18n),
    formatCurrency: i18n.formatCurrency.bind(i18n),
    formatDate: i18n.formatDate.bind(i18n),
    supportedLanguages: i18n.getSupportedLanguages()
  };
};
