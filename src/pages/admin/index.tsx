import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            VAYRA — Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage user claims and administrative functions
          </p>
        </div>
        
        <div className="space-y-6">
          <AdminPanel />
          
          <div className="bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Admin Functions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Test User Setup</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  The test user (test@vayra.digital) should have admin claims set via Firebase Admin SDK.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Plan Access</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Admin users have access to all plan levels: free, starter, pro, premium.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Testing</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  This page is used by Playwright tests to verify admin functionality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
