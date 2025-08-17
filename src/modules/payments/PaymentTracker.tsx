import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, DollarSign, Calendar, CreditCard } from 'lucide-react';

interface Payment {
  id: string;
  debtName: string;
  amount: number;
  date: string;
  note?: string;
}

const PaymentTracker: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    debtName: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('vayra-payment-tracker');
    if (saved) {
      try {
        setPayments(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to load payment data:', e);
      }
    }
  }, []);

  // Save to localStorage on payments change
  useEffect(() => {
    localStorage.setItem('vayra-payment-tracker', JSON.stringify(payments));
  }, [payments]);

  const resetForm = () => {
    setFormData({
      debtName: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      note: ''
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.debtName || !formData.amount || !formData.date) {
      return;
    }

    const payment: Payment = {
      id: editingId || Date.now().toString(),
      debtName: formData.debtName,
      amount: parseFloat(formData.amount),
      date: formData.date,
      note: formData.note || undefined
    };

    if (editingId) {
      setPayments(prev => prev.map(p => p.id === editingId ? payment : p));
    } else {
      setPayments(prev => [...prev, payment]);
    }

    resetForm();
  };

  const handleEdit = (payment: Payment) => {
    setFormData({
      debtName: payment.debtName,
      amount: payment.amount.toString(),
      date: payment.date,
      note: payment.note || ''
    });
    setEditingId(payment.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    setPayments(prev => prev.filter(p => p.id !== id));
  };

  const getMonthlySummary = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return payments
      .filter(payment => {
        const paymentDate = new Date(payment.date);
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
      })
      .reduce((sum, payment) => sum + payment.amount, 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const sortedPayments = [...payments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Payment Tracker
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your debt payments and monitor your progress
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Summary Cards */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Payments</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${getMonthlySummary().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Payment Count</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {payments.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editingId ? 'Edit Payment' : 'Add Payment'}
              </h2>
              {!isAdding && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Payment</span>
                </button>
              )}
            </div>

            {isAdding && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Debt Name
                  </label>
                  <input
                    type="text"
                    value={formData.debtName}
                    onChange={(e) => setFormData(prev => ({ ...prev, debtName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Credit Card, Student Loan"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Note (Optional)
                  </label>
                  <textarea
                    value={formData.note}
                    onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Additional notes..."
                    rows={3}
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingId ? 'Update' : 'Add'} Payment
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Payments List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Payment History</h2>
            
            {payments.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No payments recorded yet. Add your first payment to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Debt</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Note</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPayments.map((payment) => (
                      <tr key={payment.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                          {payment.debtName}
                        </td>
                        <td className="py-3 px-4 text-green-600 dark:text-green-400 font-medium">
                          ${payment.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {formatDate(payment.date)}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {payment.note || '-'}
                        </td>
                        <td className="py-3 px-4 text-right">
                                          <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(payment)}
                    className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                    title="Edit payment"
                    aria-label={`Edit payment for ${payment.debtName}`}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(payment.id)}
                    className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    title="Delete payment"
                    aria-label={`Delete payment for ${payment.debtName}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTracker;
