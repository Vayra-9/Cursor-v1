import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePlan } from './PlanContext';

interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: string;
}

interface AIContextType {
  messages: AIMessage[];
  isOpen: boolean;
  isLoading: boolean;
  promptCount: number;
  maxPrompts: number;
  sendMessage: (content: string, context?: string) => Promise<void>;
  toggleCopilot: () => void;
  clearMessages: () => void;
  canSendMessage: boolean;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

interface AIProviderProps {
  children: ReactNode;
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const { tier } = usePlan();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Plan-based prompt limits
  const getMaxPrompts = () => {
    switch (tier) {
      case 'free':
        return 2;
      case 'starter':
        return 5;
      case 'pro':
      case 'premium':
        return Infinity;
      default:
        return 2;
    }
  };

  const maxPrompts = getMaxPrompts();
  const promptCount = messages.filter(m => m.type === 'user').length;
  const canSendMessage = promptCount < maxPrompts;

  // Context-aware AI responses
  const generateAIResponse = async (userMessage: string, context?: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const responses = {
      debt: [
        "Based on your debt situation, I recommend focusing on the highest interest rate debt first (avalanche method). This will save you the most money in the long run. Consider allocating any extra income to your credit card debt.",
        "Your debt-to-income ratio suggests you're in a manageable position. Try to pay more than the minimum on your highest interest debts to accelerate your payoff timeline.",
        "I notice you have multiple debts. Consider consolidating high-interest debts if possible, or use the snowball method for quick wins to stay motivated."
      ],
      budget: [
        "Your budget looks well-balanced! Consider setting aside 20% of your income for debt payments and 10% for emergency savings. This will help you build financial security while paying off debt.",
        "I see you're tracking your expenses well. Try the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for debt payments and savings.",
        "Great job on budgeting! Remember to include irregular expenses like car maintenance and holidays in your monthly budget planning."
      ],
      payoff: [
        "Your payoff strategy is solid! With consistent payments, you could be debt-free in about 3-4 years. Consider increasing your payments by even $50-100 monthly to shave off months from your timeline.",
        "I love your aggressive payoff approach! You're on track to save thousands in interest. Keep up the momentum and celebrate small wins along the way.",
        "Your payoff plan shows great discipline. Remember to build an emergency fund alongside debt payments to avoid taking on new debt if unexpected expenses arise."
      ],
      general: [
        "You're making excellent progress on your financial journey! Stay consistent with your payments and remember that every dollar counts toward your debt-free goal.",
        "Financial freedom is within reach! Keep focusing on your goals and don't get discouraged by setbacks. You're building habits that will serve you for life.",
        "I'm impressed by your commitment to getting out of debt. Remember to celebrate your progress and stay motivated - you're closer to financial freedom than you think!"
      ]
    };

    // Determine context and select appropriate response
    let contextType = 'general';
    if (context) {
      if (context.includes('debt') || context.includes('loan')) contextType = 'debt';
      else if (context.includes('budget') || context.includes('expense')) contextType = 'budget';
      else if (context.includes('payoff') || context.includes('strategy')) contextType = 'payoff';
    }

    const contextResponses = responses[contextType as keyof typeof responses];
    const randomResponse = contextResponses[Math.floor(Math.random() * contextResponses.length)];

    return randomResponse;
  };

  const sendMessage = async (content: string, context?: string) => {
    if (!canSendMessage) {
      return;
    }

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
      context
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(content, context);
      
      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCopilot = () => {
    setIsOpen(!isOpen);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  // Add welcome message when copilot is first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: AIMessage = {
        id: 'welcome',
        type: 'assistant',
        content: `Hello! I'm your VAYRA AI assistant. I can help you with debt planning, budgeting advice, and payoff strategies. You have ${maxPrompts === Infinity ? 'unlimited' : maxPrompts} questions available with your ${tier} plan. How can I help you today?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, maxPrompts, tier]);

  const value: AIContextType = {
    messages,
    isOpen,
    isLoading,
    promptCount,
    maxPrompts,
    sendMessage,
    toggleCopilot,
    clearMessages,
    canSendMessage
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = (): AIContextType => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
