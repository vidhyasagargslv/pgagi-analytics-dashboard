// src/components/common/ErrorMessage.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <motion.div 
      role="alert" 
      className="alert alert-error shadow-lg border border-red-200"
      initial={{ opacity: 0, x: -50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <motion.svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="stroke-current shrink-0 h-6 w-6" 
        fill="none" 
        viewBox="0 0 24 24"
        animate={{ 
          rotate: [0, -10, 10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </motion.svg>
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        Error! {message}
      </motion.span>
      {onRetry && (
        <motion.button 
          className="btn btn-sm btn-ghost hover:bg-red-100 transition-colors duration-200" 
          onClick={onRetry}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Retry
        </motion.button>
      )}
    </motion.div>
  );
};

export default ErrorMessage;