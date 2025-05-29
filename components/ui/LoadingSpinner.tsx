
import React from 'react';

const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  let sizeClass = 'loading-lg';
  if (size === 'sm') sizeClass = 'loading-sm';
  if (size === 'md') sizeClass = 'loading-md';

  return (
    <div className="flex justify-center items-center p-4">
      <span className={`loading loading-spinner text-primary ${sizeClass}`}></span>
    </div>
  );
};

export default LoadingSpinner;