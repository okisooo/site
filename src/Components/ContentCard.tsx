import React from 'react';

interface ContentCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function ContentCard({ title, children, className = "" }: ContentCardProps) {
  return (
    <div className={`ui-card p-4 sm:p-6 mb-4 sm:mb-6 ${className}`}>
      {title && (
        <>
          <h2 className="card-title h-display h-neon text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-center sm:text-left">
            {title}
          </h2>
          <hr className="divider mb-3 sm:mb-4" />
        </>
      )}
      <div>{children}</div>
    </div>
  );
}