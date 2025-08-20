import React from 'react';

interface VayraLogoProps {
  className?: string;
  alt?: string;
}

const VayraLogo: React.FC<VayraLogoProps> = ({ 
  className = '',
  alt = 'VAYRA'
}) => {
  return (
    <img 
      src="/brand/vayra-logo.svg" 
      alt={alt}
      className={`object-contain ${className}`}
      loading="eager" 
      fetchPriority="high"
    />
  );
};

export default VayraLogo;
