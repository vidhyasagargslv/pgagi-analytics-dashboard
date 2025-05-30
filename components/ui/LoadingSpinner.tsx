
import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  let sizeClass = 'loading-lg';
  let dotSize = 'w-4 h-4';
  if (size === 'sm') {
    sizeClass = 'loading-sm';
    dotSize = 'w-2 h-2';
  }
  if (size === 'md') {
    sizeClass = 'loading-md';
    dotSize = 'w-3 h-3';
  }

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const dotVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className="flex justify-center items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex space-x-2 items-center">
        <motion.div
          className="flex space-x-1"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className={`${dotSize} bg-gradient-to-r from-blue-500 to-purple-500 rounded-full`}
              variants={dotVariants}
            />
          ))}
        </motion.div>
        
      </div>
    </motion.div>
  );
};

export default LoadingSpinner;