import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PaymentTracker from '../PaymentTracker';

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

describe('PaymentTracker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders payment tracker with initial state', () => {
    render(<PaymentTracker />);
    
    expect(screen.getByText('Payment Tracker')).toBeInTheDocument();
    expect(screen.getByText('Track your debt payments and monitor your progress')).toBeInTheDocument();
    expect(screen.getByText('Add Payment')).toBeInTheDocument();
    expect(screen.getByText('Payment History')).toBeInTheDocument();
  });

  it('loads payments from localStorage on mount', () => {
    const savedPayments = [
      { id: '1', debtName: 'Credit Card', amount: 500, date: '2024-01-15', note: 'Monthly payment' }
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedPayments));

    render(<PaymentTracker />);
    
    expect(localStorageMock.getItem).toHaveBeenCalledWith('vayra-payment-tracker');
  });

  it('saves payments to localStorage when updated', async () => {
    render(<PaymentTracker />);
    
    // Add a payment
    const addButton = screen.getByText('Add Payment');
    fireEvent.click(addButton);

    const debtNameInput = screen.getByLabelText('Debt Name');
    const amountInput = screen.getByLabelText('Amount');
    const dateInput = screen.getByLabelText('Date');

    fireEvent.change(debtNameInput, { target: { value: 'Student Loan' } });
    fireEvent.change(amountInput, { target: { value: '300' } });
    fireEvent.change(dateInput, { target: { value: '2024-01-20' } });

    const submitButton = screen.getByText('Add Payment');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'vayra-payment-tracker',
        expect.stringContaining('Student Loan')
      );
    });
  });

  it('adds a new payment', async () => {
    render(<PaymentTracker />);
    
    // Click add payment
    const addButton = screen.getByText('Add Payment');
    fireEvent.click(addButton);

    // Fill form
    const debtNameInput = screen.getByLabelText('Debt Name');
    const amountInput = screen.getByLabelText('Amount');
    const dateInput = screen.getByLabelText('Date');

    fireEvent.change(debtNameInput, { target: { value: 'Credit Card' } });
    fireEvent.change(amountInput, { target: { value: '250' } });
    fireEvent.change(dateInput, { target: { value: '2024-01-15' } });

    // Submit
    const submitButton = screen.getByText('Add Payment');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Credit Card')).toBeInTheDocument();
      expect(screen.getByText('$250')).toBeInTheDocument();
    });
  });

  it('edits an existing payment', async () => {
    // Setup with existing payment
    const savedPayments = [
      { id: '1', debtName: 'Credit Card', amount: 250, date: '2024-01-15', note: '' }
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedPayments));

    render(<PaymentTracker />);
    
    // Wait for payment to load
    await waitFor(() => {
      expect(screen.getByText('Credit Card')).toBeInTheDocument();
    });

    // Click edit
    const editButton = screen.getByTitle('Edit payment');
    fireEvent.click(editButton);

    // Update amount
    const amountInput = screen.getByLabelText('Amount');
    fireEvent.change(amountInput, { target: { value: '300' } });

    // Submit
    const updateButton = screen.getByText('Update Payment');
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText('$300')).toBeInTheDocument();
    });
  });

  it('deletes a payment', async () => {
    // Setup with existing payment
    const savedPayments = [
      { id: '1', debtName: 'Credit Card', amount: 250, date: '2024-01-15', note: '' }
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedPayments));

    render(<PaymentTracker />);
    
    // Wait for payment to load
    await waitFor(() => {
      expect(screen.getByText('Credit Card')).toBeInTheDocument();
    });

    // Click delete
    const deleteButton = screen.getByTitle('Delete payment');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText('Credit Card')).not.toBeInTheDocument();
    });
  });

  it('calculates monthly summary correctly', async () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const savedPayments = [
      { 
        id: '1', 
        debtName: 'Credit Card', 
        amount: 250, 
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-15`, 
        note: '' 
      },
      { 
        id: '2', 
        debtName: 'Student Loan', 
        amount: 300, 
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-20`, 
        note: '' 
      }
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedPayments));

    render(<PaymentTracker />);
    
    await waitFor(() => {
      expect(screen.getByText('$550')).toBeInTheDocument(); // 250 + 300
    });
  });

  it('shows empty state when no payments', () => {
    render(<PaymentTracker />);
    
    expect(screen.getByText('No payments recorded yet. Add your first payment to get started.')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<PaymentTracker />);
    
    // Click add payment
    const addButton = screen.getByText('Add Payment');
    fireEvent.click(addButton);

    // Try to submit without filling required fields
    const submitButton = screen.getByText('Add Payment');
    fireEvent.click(submitButton);

    // Should not add payment
    await waitFor(() => {
      expect(screen.getByText('No payments recorded yet. Add your first payment to get started.')).toBeInTheDocument();
    });
  });

  it('cancels form when cancel button is clicked', async () => {
    render(<PaymentTracker />);
    
    // Click add payment
    const addButton = screen.getByText('Add Payment');
    fireEvent.click(addButton);

    // Fill some data
    const debtNameInput = screen.getByLabelText('Debt Name');
    fireEvent.change(debtNameInput, { target: { value: 'Credit Card' } });

    // Click cancel
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    // Form should be hidden
    await waitFor(() => {
      expect(screen.queryByLabelText('Debt Name')).not.toBeInTheDocument();
    });
  });
});
