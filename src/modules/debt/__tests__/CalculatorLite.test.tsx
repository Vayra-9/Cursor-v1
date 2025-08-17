import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CalculatorLite from '../CalculatorLite';

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

describe('CalculatorLite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders calculator with initial state', () => {
    render(<CalculatorLite />);
    
    expect(screen.getByText('Debt Calculator (Lite)')).toBeInTheDocument();
    expect(screen.getByText('Income & Expenses')).toBeInTheDocument();
    expect(screen.getByText('Debts')).toBeInTheDocument();
    expect(screen.getByText('Results')).toBeInTheDocument();
  });

  it('loads state from localStorage on mount', () => {
    const savedState = {
      income: 5000,
      expenses: 2000,
      debts: [
        { id: '1', name: 'Credit Card', principal: 5000, rate: 15, minPayment: 150 }
      ]
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedState));

    render(<CalculatorLite />);
    
    expect(localStorageMock.getItem).toHaveBeenCalledWith('vayra-calculator-lite');
  });

  it('saves state to localStorage when updated', async () => {
    render(<CalculatorLite />);
    
    const incomeInput = screen.getByLabelText('Monthly Income');
    fireEvent.change(incomeInput, { target: { value: '5000' } });

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'vayra-calculator-lite',
        expect.stringContaining('"income":5000')
      );
    });
  });

  it('calculates disposable income correctly', async () => {
    render(<CalculatorLite />);
    
    // Set income and expenses
    const incomeInput = screen.getByLabelText('Monthly Income');
    const expensesInput = screen.getByLabelText('Monthly Expenses');
    
    fireEvent.change(incomeInput, { target: { value: '5000' } });
    fireEvent.change(expensesInput, { target: { value: '2000' } });

    // Add a debt
    const addDebtButton = screen.getByText('Add Debt');
    fireEvent.click(addDebtButton);

    // Fill debt details
    const principalInput = screen.getByDisplayValue('0');
    fireEvent.change(principalInput, { target: { value: '1000' } });

    await waitFor(() => {
      expect(screen.getByText('$2,000')).toBeInTheDocument(); // 5000 - 2000 - 0 = 3000
    });
  });

  it('adds and removes debts', () => {
    render(<CalculatorLite />);
    
    // Add debt
    const addDebtButton = screen.getByText('Add Debt');
    fireEvent.click(addDebtButton);

    expect(screen.getByPlaceholderText('Debt name')).toBeInTheDocument();

    // Remove debt
    const removeButton = screen.getByTitle('Remove debt');
    fireEvent.click(removeButton);

    expect(screen.queryByPlaceholderText('Debt name')).not.toBeInTheDocument();
  });

  it('validates input values', async () => {
    render(<CalculatorLite />);
    
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

  it('calculates payoff estimate', async () => {
    render(<CalculatorLite />);
    
    // Set income and expenses
    const incomeInput = screen.getByLabelText('Monthly Income');
    const expensesInput = screen.getByLabelText('Monthly Expenses');
    
    fireEvent.change(incomeInput, { target: { value: '5000' } });
    fireEvent.change(expensesInput, { target: { value: '2000' } });

    // Add debt with principal
    const addDebtButton = screen.getByText('Add Debt');
    fireEvent.click(addDebtButton);

    const principalInputs = screen.getAllByDisplayValue('0');
    fireEvent.change(principalInputs[0], { target: { value: '12000' } }); // 12k debt

    await waitFor(() => {
      expect(screen.getByText('4 months')).toBeInTheDocument(); // 12000 / 3000 = 4 months
    });
  });

  it('shows empty state when no debts', () => {
    render(<CalculatorLite />);
    
    expect(screen.getByText('No debts added yet. Click "Add Debt" to get started.')).toBeInTheDocument();
  });
});
