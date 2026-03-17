'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
    name: string;
    role: string;
    affiliation: string;
    tags: string[];
    imageSrc?: string;
    className?: string;
}

export default function ProfileCard({
    name,
    role,
    affiliation,
    tags,
    imageSrc,
    className,
}: ProfileCardProps) {
    return (
        <div className={cn(
            'relative bg-white/90 backdrop-blur-md rounded-ba-lg overflow-hidden',
            'border-2 border-ba-sky/20 shadow-ba-card',
            className
        )}>
            {/* Header gradient band */}
            <div className="h-2 bg-gradient-to-r from-ba-sky via-ba-pink to-ba-yellow" />

            <div className="p-6">
                {/* Avatar + Info */}
                <div className="flex items-start gap-5">
                    {imageSrc && (
                        <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-ba-sky/30 flex-shrink-0">
                            <Image
                                src={imageSrc}
                                alt={name}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-display font-black text-ba-dark tracking-tight">
                            {name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-bold text-ba-sky-deep">{role}</span>
                            <span className="text-ba-muted">·</span>
                            <span className="text-sm text-ba-muted">{affiliation}</span>
                        </div>
                    </div>
                </div>

                {/* Bio Tags */}
                <div className="flex flex-wrap gap-2 mt-5">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="text-xs font-bold font-display px-3 py-1 rounded-ba-pill bg-ba-sky/10 text-ba-sky-deep border border-ba-sky/20"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
