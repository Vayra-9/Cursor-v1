import React from 'react';

interface VayraLogoProps {
  className?: string;
  alt?: string;
  variant?: 'default' | 'hero' | 'compact';
}

const VayraLogo: React.FC<VayraLogoProps> = ({ 
  className = '',
  alt = 'VAYRA',
  variant = 'default'
}) => {
  const baseClasses = "object-contain";
  const variantClasses = {
    default: "h-7 md:h-8 w-7 md:w-8",
    hero: "h-10 md:h-12 w-10 md:w-12",
    compact: "h-5 md:h-6 w-5 md:w-6"
  };

  // Get dimensions for explicit width/height
  const getDimensions = () => {
    switch (variant) {
      case 'hero':
        return { width: 48, height: 48 }; // 12 * 4 = 48px
      case 'compact':
        return { width: 24, height: 24 }; // 6 * 4 = 24px
      default:
        return { width: 32, height: 32 }; // 8 * 4 = 32px
    }
  };

  const { width, height } = getDimensions();

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Enhanced Logo Container with Proper Sizing */}
      <div className={`relative ${variantClasses[variant]} logo-float`}>
        {/* Animated Glow Effect - Reduced Scale */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-md scale-105 logo-glow"></div>
        
        {/* Main Logo with Premium Styling */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-full p-0.5 shadow-lg border border-gray-700/50 backdrop-blur-sm">
          <img 
            src="/brand/vayra-logo.svg" 
            alt={alt}
            width={width}
            height={height}
            className={`${baseClasses} w-full h-full rounded-full`}
            loading="eager" 
            decoding="async"
          />
        </div>
        
        {/* Animated Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-full logo-shimmer"></div>
        
        {/* Additional Glow Rings - Reduced Scale */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/8 via-purple-500/8 to-pink-500/8 rounded-full scale-110 blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/4 via-purple-400/4 to-pink-400/4 rounded-full scale-115 blur-md"></div>
      </div>
      
      {/* Enhanced Brand Text */}
      {variant === 'hero' && (
        <div className="mt-2 text-center">
          <h1 className="text-2xl md:text-3xl font-bold premium-gradient-text">
            VAYRA
          </h1>
          <p className="text-xs md:text-sm text-gray-400 font-medium tracking-wider mt-1">
            OUTSMART. OUTWORK. OUT-EARN.
          </p>
        </div>
      )}
    </div>
  );
};

export default VayraLogo;
