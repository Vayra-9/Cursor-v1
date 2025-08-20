import React from 'react';

interface VayraLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

const VayraLogo: React.FC<VayraLogoProps> = ({ 
  size = 'md', 
  className = '',
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative`}>
        <img 
          src="/brand/vayra-logo.svg" 
          alt="VAYRA" 
          className="w-full h-full"
          loading="eager" 
          fetchPriority="high"
        />
      </div>
      
      {/* Logo Text */}
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ${textSizes[size]}`}>
          VAYRA
        </span>
      )}
    </div>
  );
};

export default VayraLogo;
