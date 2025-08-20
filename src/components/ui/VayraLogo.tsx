import React from 'react';

interface VayraLogoProps {
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
}

const VayraLogo: React.FC<VayraLogoProps> = ({ 
  className = "block h-8 w-auto object-contain select-none",
  alt = "VAYRA",
  width,
  height
}) => {
  return (
    <img 
      src="/brand/vayra-logo.svg" 
      alt={alt}
      className={className}
      width={width}
      height={height}
      decoding="async"
      loading="lazy"
    />
  );
};

export default VayraLogo;
