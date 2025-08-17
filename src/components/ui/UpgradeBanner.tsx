import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, X } from 'lucide-react';
import { motion } from 'framer-motion';

const UpgradeBanner: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="w-4 h-4" />
            <h3 className="text-sm font-semibold">Upgrade to Pro</h3>
          </div>
          <p className="text-xs text-blue-100 mb-3">
            Unlock unlimited debts, advanced analytics, and AI-powered insights
          </p>
          <Link
            to="/pricing"
            className="inline-flex items-center text-xs font-medium text-white hover:text-blue-100 transition-colors duration-200"
          >
            Learn more
            <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>
        <button
          className="text-blue-100 hover:text-white transition-colors duration-200"
          aria-label="Dismiss upgrade banner"
        >
          <span aria-label="Dismiss upgrade banner"><X className="w-4 h-4" /></span>
        </button>
      </div>
    </motion.div>
  );
};

export default UpgradeBanner; 