import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';

export default function AdminPanel() {
  const [claims, setClaims] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const auth = getAuth();
    const load = async () => {
      try {
        if (!auth.currentUser) {
          setClaims(null);
          setLoading(false);
          return;
        }
        
        // Refresh token to get latest claims
        await auth.currentUser.getIdToken(true).catch(() => {});
        const tokenResult = await auth.currentUser.getIdTokenResult().catch(() => null);
        setClaims(tokenResult ? tokenResult.claims : null);
      } catch (error) {
        console.error('Error loading claims:', error);
        setClaims(null);
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, []);

  if (loading) {
    return (
      <div data-testid="admin-panel" className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Admin Panel</h3>
        <p>Loading claims...</p>
      </div>
    );
  }

  return (
    <div data-testid="admin-panel" className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Admin Panel</h3>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Claims:</h4>
        <pre 
          data-testid="admin-claims" 
          className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm text-gray-800 dark:text-gray-200 overflow-auto max-h-64"
        >
          {claims ? JSON.stringify(claims, null, 2) : 'No claims yet'}
        </pre>
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p className="mb-2">
          <strong>Tip:</strong> Sign out and sign back in after assigning claims to refresh token.
        </p>
        <p>
          <strong>Admin Status:</strong> {claims?.role === 'admin' ? '✅ Admin' : '❌ Not Admin'}
        </p>
        {claims?.plans && (
          <p>
            <strong>Available Plans:</strong> {Array.isArray(claims.plans) ? claims.plans.join(', ') : 'None'}
          </p>
        )}
      </div>
    </div>
  );
}
