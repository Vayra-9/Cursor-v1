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
  const variantClasses = {
    default: "h-8 w-8 md:h-9 md:w-9",
    hero: "h-12 w-12 md:h-16 md:w-16",
    compact: "h-6 w-6 md:h-7 md:w-7"
  };

  // Get dimensions for explicit width/height
  const getDimensions = () => {
    switch (variant) {
      case 'hero':
        return { width: 64, height: 64 }; // 16 * 4 = 64px
      case 'compact':
        return { width: 28, height: 28 }; // 7 * 4 = 28px
      default:
        return { width: 36, height: 36 }; // 9 * 4 = 36px
    }
  };

  const { width, height } = getDimensions();

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Logo Container with Proper Sizing */}
      <div className={`relative ${variantClasses[variant]} flex items-center justify-center`}>
        {/* Subtle Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-full blur-sm scale-105"></div>
        
        {/* Main Logo */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-full p-0.5 shadow-md border border-gray-700/30">
          <img 
            src="/brand/vayra-logo.svg" 
            alt={alt}
            width={width}
            height={height}
            className="w-full h-full object-contain rounded-full"
            loading="eager" 
            decoding="async"
          />
        </div>
        
        {/* Subtle Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Brand Text for Hero Variant */}
      {variant === 'hero' && (
        <div className="mt-3 text-center">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
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
