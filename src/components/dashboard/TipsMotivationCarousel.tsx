import React from 'react';
import { Lightbulb } from 'lucide-react';

const TipsMotivationCarousel: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
          <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tips & Motivation</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Auto-rotating financial tips</p>
        </div>
      </div>
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Tips & motivation carousel coming soon...</p>
      </div>
    </div>
  );
};

export default TipsMotivationCarousel; 