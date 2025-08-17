import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Shield } from 'lucide-react';

interface GrandfatheredBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const GrandfatheredBadge: React.FC<GrandfatheredBadgeProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        inline-flex items-center gap-1.5
        bg-gradient-to-r from-amber-500 to-orange-500
        text-white font-medium rounded-full
        shadow-lg border border-amber-400/30
        ${sizeClasses[size]}
        ${className}
      `}
      title="Grandfathered pricing - locked to original rate"
    >
      <Crown size={iconSizes[size]} className="text-amber-200" />
      <span>Grandfathered</span>
      <Shield size={iconSizes[size]} className="text-amber-200" />
    </motion.div>
  );
};

export default GrandfatheredBadge;
