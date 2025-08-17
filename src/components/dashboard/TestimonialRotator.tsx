import React from 'react';
import { Star } from 'lucide-react';

const TestimonialRotator: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
          <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Testimonial Rotator</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">5–6 realistic, location-tagged reviews</p>
        </div>
      </div>
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Testimonial rotator module coming soon...</p>
      </div>
    </div>
  );
};

export default TestimonialRotator; 