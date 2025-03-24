import React from 'react';

interface ContentCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function ContentCard({ title, children, className = "" }: ContentCardProps) {
  return (
    <div className={`rounded-xl bg-black/30 backdrop-blur-card border border-white/10 p-5 mb-6 shadow-lg ${className}`}>
      {title && (
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-shadow-md">
          {title}
        </h2>
      )}
      <div>{children}</div>
    </div>
  );
}