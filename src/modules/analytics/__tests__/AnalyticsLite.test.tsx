import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AnalyticsLite from '../AnalyticsLite';

// Mock recharts to avoid canvas issues in tests
vi.mock('recharts', () => ({
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />
}));

// Mock usePlan hook
vi.mock('@/contexts/PlanContext', () => ({
  usePlan: () => ({
    tier: 'free'
  })
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('AnalyticsLite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders analytics component with initial state', () => {
    render(<AnalyticsLite />);
    
    expect(screen.getByText('Analytics (Lite)')).toBeInTheDocument();
    expect(screen.getByText('Analyze your debt-to-income ratio and visualize your financial data')).toBeInTheDocument();
    expect(screen.getByText('DTI Calculator')).toBeInTheDocument();
    expect(screen.getByText('Debt Overview')).toBeInTheDocument();
    expect(screen.getByText('Debt Distribution')).toBeInTheDocument();
  });

  it('loads analytics data from localStorage on mount', () => {
    const savedData = {
      monthlyIncome: 5000,
      monthlyDebts: [
        { name: 'Credit Card', balance: 5000, payment: 200 }
      ]
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedData));

    render(<AnalyticsLite />);
    
    expect(localStorageMock.getItem).toHaveBeenCalledWith('vayra-analytics-lite');
  });

  it('saves analytics data to localStorage when updated', async () => {
    render(<AnalyticsLite />);
    
    const incomeInput = screen.getByLabelText('Monthly Income');
    fireEvent.change(incomeInput, { target: { value: '5000' } });

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'vayra-analytics-lite',
        expect.stringContaining('"monthlyIncome":5000')
      );
    });
  });

  it('calculates DTI ratio correctly', async () => {
    render(<AnalyticsLite />);
    
    // Set income
    const incomeInput = screen.getByLabelText('Monthly Income');
    fireEvent.change(incomeInput, { target: { value: '5000' } });

    // Add debt
    const addDebtButton = screen.getByText('+ Add Debt');
    fireEvent.click(addDebtButton);

    // Set debt payment
    const paymentInputs = screen.getAllByDisplayValue('0');
    fireEvent.change(paymentInputs[1], { target: { value: '1000' } }); // Payment field

    await waitFor(() => {
      expect(screen.getByText('20.0%')).toBeInTheDocument(); // 1000/5000 * 100
      expect(screen.getByText('Excellent')).toBeInTheDocument();
    });
  });

  it('adds and removes debts', async () => {
    render(<AnalyticsLite />);
    
    // Add debt
    const addDebtButton = screen.getByText('+ Add Debt');
    fireEvent.click(addDebtButton);

    expect(screen.getByPlaceholderText('Debt name')).toBeInTheDocument();

    // Remove debt
    const removeButton = screen.getByTitle('Remove debt');
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Debt name')).not.toBeInTheDocument();
    });
  });

  it('updates debt information', async () => {
    render(<AnalyticsLite />);
    
    // Add debt
    const addDebtButton = screen.getByText('+ Add Debt');
    fireEvent.click(addDebtButton);

    // Update debt name
    const nameInput = screen.getByPlaceholderText('Debt name');
    fireEvent.change(nameInput, { target: { value: 'Student Loan' } });

    // Update balance
    const balanceInputs = screen.getAllByDisplayValue('0');
    fireEvent.change(balanceInputs[0], { target: { value: '25000' } });

    await waitFor(() => {
      expect(nameInput).toHaveValue('Student Loan');
    });
  });

  it('shows DTI status based on ratio', async () => {
    render(<AnalyticsLite />);
    
    // Set income
    const incomeInput = screen.getByLabelText('Monthly Income');
    fireEvent.change(incomeInput, { target: { value: '5000' } });

    // Add debt with high payment
    const addDebtButton = screen.getByText('+ Add Debt');
    fireEvent.click(addDebtButton);

    const paymentInputs = screen.getAllByDisplayValue('0');
    fireEvent.change(paymentInputs[1], { target: { value: '2500' } }); // 50% DTI

    await waitFor(() => {
      expect(screen.getByText('50.0%')).toBeInTheDocument();
      expect(screen.getByText('Poor')).toBeInTheDocument();
    });
  });

  it('limits debts for free plan', () => {
    render(<AnalyticsLite />);
    
    // Add 3 debts (free plan limit)
    for (let i = 0; i < 3; i++) {
      const addDebtButton = screen.getByText('+ Add Debt');
      fireEvent.click(addDebtButton);
    }

    // Should not show add button after 3 debts
    expect(screen.queryByText('+ Add Debt')).not.toBeInTheDocument();
  });

  it('shows free plan upgrade message', () => {
    render(<AnalyticsLite />);
    
    expect(screen.getByText('💡 Free plan shows limited data. Upgrade to see full analytics.')).toBeInTheDocument();
  });

  it('renders charts when data is available', async () => {
    const savedData = {
      monthlyIncome: 5000,
      monthlyDebts: [
        { name: 'Credit Card', balance: 5000, payment: 200 },
        { name: 'Student Loan', balance: 25000, payment: 300 }
      ]
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedData));

    render(<AnalyticsLite />);
    
    await waitFor(() => {
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });
  });

  it('shows empty state when no debt data', () => {
    render(<AnalyticsLite />);
    
    expect(screen.getAllByText('No debt data available. Add your debts to see charts.')).toHaveLength(2);
  });

  it('validates input values', async () => {
    render(<AnalyticsLite />);
    
    const incomeInput = screen.getByLabelText('Monthly Income');
    
    // Test negative value
    fireEvent.change(incomeInput, { target: { value: '-1000' } });
    await waitFor(() => {
      expect(incomeInput).toHaveValue(0);
    });

    // Test invalid value
    fireEvent.change(incomeInput, { target: { value: 'abc' } });
    await waitFor(() => {
      expect(incomeInput).toHaveValue(0);
    });
  });

  it('displays correct DTI recommendations', async () => {
    render(<AnalyticsLite />);
    
    // Set income
    const incomeInput = screen.getByLabelText('Monthly Income');
    fireEvent.change(incomeInput, { target: { value: '5000' } });

    // Add debt with 25% DTI
    const addDebtButton = screen.getByText('+ Add Debt');
    fireEvent.click(addDebtButton);

    const paymentInputs = screen.getAllByDisplayValue('0');
    fireEvent.change(paymentInputs[1], { target: { value: '1250' } }); // 25% DTI

    await waitFor(() => {
      expect(screen.getByText('Good - Your debt-to-income ratio is manageable')).toBeInTheDocument();
    });
  });
});
