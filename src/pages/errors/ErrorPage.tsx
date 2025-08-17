import React from 'react';

const ErrorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Error</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Something went wrong</p>
      </div>
    </div>
  );
};

export default ErrorPage; 