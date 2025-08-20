import React from 'react';
import { motion } from 'framer-motion';

interface VayraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  showTagline?: boolean;
  variant?: 'default' | 'hero' | 'header';
  animate?: boolean;
}

const VayraLogo: React.FC<VayraLogoProps> = ({ 
  size = 'md', 
  className = '',
  showText = true,
  showTagline = false,
  variant = 'default',
  animate = false
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const taglineSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut"
      }
    }
  };

  const taglineVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.4,
        ease: "easeOut"
      }
    }
  };

  const LogoWrapper = animate ? motion.div : 'div';
  const TextWrapper = animate ? motion.div : 'div';
  const TaglineWrapper = animate ? motion.div : 'div';

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center space-x-2">
        {/* Logo Icon */}
        <LogoWrapper
          {...(animate && { variants: logoVariants, initial: "hidden", animate: "visible" })}
          className={`${sizeClasses[size]} relative`}
        >
          <img 
            src="/brand/vayra-logo.svg" 
            alt="VAYRA" 
            className="w-full h-full object-contain"
            loading="eager" 
            fetchPriority="high"
          />
        </LogoWrapper>
        
        {/* Logo Text */}
        {showText && (
          <TextWrapper
            {...(animate && { variants: textVariants, initial: "hidden", animate: "visible" })}
          >
            <span className={`font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ${textSizes[size]}`}>
              VAYRA
            </span>
          </TextWrapper>
        )}
      </div>
      
      {/* Tagline */}
      {showTagline && (
        <TaglineWrapper
          {...(animate && { variants: taglineVariants, initial: "hidden", animate: "visible" })}
          className="mt-1"
        >
          <span className={`text-gray-600 dark:text-gray-400 font-medium ${taglineSizes[size]}`}>
            Outsmart. Outwork. Out-earn.
          </span>
        </TaglineWrapper>
      )}
    </div>
  );
};

export default VayraLogo;
