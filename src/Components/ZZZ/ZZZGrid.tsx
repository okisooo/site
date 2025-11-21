import React from 'react';
import { cn } from '@/lib/utils';

interface ZZZGridProps {
    children: React.ReactNode;
    className?: string;
}

const ZZZGrid: React.FC<ZZZGridProps> = ({ children, className }) => {
    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4", className)}>
            {children}
        </div>
    );
};

export default ZZZGrid;
