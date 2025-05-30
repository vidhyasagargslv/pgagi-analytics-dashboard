import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`card bg-base-100 shadow-xl ${className}`}>
      {title && (
        <div className="card-title p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}
      <div className="card-body p-0">
        {children}
      </div>
    </div>
  );
}