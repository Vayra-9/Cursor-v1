import React from 'react';
import { BookOpen } from 'lucide-react';

const DebtEducationMicroCourse: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
          <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Debt Education Micro-Course</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Free 7-day series</p>
        </div>
      </div>
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Debt education micro-course coming soon...</p>
      </div>
    </div>
  );
};

export default DebtEducationMicroCourse; 