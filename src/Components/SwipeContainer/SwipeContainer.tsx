"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface SwipeContainerProps {
    children: React.ReactNode;
}

export default function SwipeContainer({ children }: SwipeContainerProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Page order and navigation logic
    const getPageOrder = () => {
        switch (pathname) {
            case '/': return { prev: '/upcoming', current: '/', next: '/releases' };
            case '/upcoming': return { prev: null, current: '/upcoming', next: '/' };
            case '/releases': return { prev: '/', current: '/releases', next: null };
            default: return { prev: null, current: pathname, next: null };
        }
    };

    const pageOrder = getPageOrder();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (!isMobile || isTransitioning) return;

        setIsDragging(true);
        setStartX(e.touches[0].clientX);
        setCurrentX(e.touches[0].clientX);
        setDragOffset(0);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || !isMobile || isTransitioning) return;

        e.preventDefault();
        const deltaX = e.touches[0].clientX - startX;
        const maxDrag = window.innerWidth * 0.8; // Maximum drag distance

        // Apply resistance at the edges
        let resistedDelta = deltaX;
        if ((deltaX > 0 && !pageOrder.prev) || (deltaX < 0 && !pageOrder.next)) {
            resistedDelta = deltaX * 0.3; // Add resistance when there's no page to go to
        }

        setCurrentX(e.touches[0].clientX);
        setDragOffset(Math.max(-maxDrag, Math.min(maxDrag, resistedDelta)));
    };

    const handleTouchEnd = () => {
        if (!isDragging || !isMobile || isTransitioning) return;

        setIsDragging(false);
        const deltaX = currentX - startX;
        const threshold = window.innerWidth * 0.25; // 25% of screen width
        const velocity = Math.abs(deltaX) / 100; // Simple velocity calculation

        let targetPage: string | null = null;

        // Determine target page based on drag distance and velocity
        if (deltaX > threshold && pageOrder.prev) {
            targetPage = pageOrder.prev;
        } else if (deltaX < -threshold && pageOrder.next) {
            targetPage = pageOrder.next;
        }

        // Reset position with animation
        setIsTransitioning(true);
        setDragOffset(0);

        // Navigate if page should change
        if (targetPage) {
            setTimeout(() => {
                router.push(targetPage);
                setIsTransitioning(false);
            }, 150);
        } else {
            setTimeout(() => {
                setIsTransitioning(false);
            }, 200);
        }
    };

    if (!isMobile) {
        return <>{children}</>;
    }

    return (
        <div
            className="fixed inset-0 overflow-hidden touch-none select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
            {/* Previous page preview */}
            {pageOrder.prev && (
                <div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200"
                    style={{
                        opacity: isDragging && dragOffset > 50 ? Math.min(0.8, dragOffset / 200) : 0,
                        transform: `translateX(${Math.min(0, -100 + (dragOffset / window.innerWidth) * 100)}vw)`
                    }}
                >
                    <div className="text-white text-center">
                        <div className="text-2xl mb-2">←</div>
                        <div className="text-sm opacity-80">
                            {pageOrder.prev === '/' && 'Home'}
                            {pageOrder.prev === '/upcoming' && 'Upcoming'}
                            {pageOrder.prev === '/releases' && 'Releases'}
                        </div>
                    </div>
                </div>
            )}

            {/* Current page */}
            <div
                className="relative w-full h-full transition-transform"
                style={{
                    transform: `translateX(${dragOffset}px) scale(${isDragging ? 0.95 : 1})`,
                    transitionDuration: isDragging ? '0ms' : isTransitioning ? '200ms' : '150ms',
                    transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
            >
                {children}
            </div>

            {/* Next page preview */}
            {pageOrder.next && (
                <div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200"
                    style={{
                        opacity: isDragging && dragOffset < -50 ? Math.min(0.8, Math.abs(dragOffset) / 200) : 0,
                        transform: `translateX(${Math.max(0, 100 + (dragOffset / window.innerWidth) * 100)}vw)`
                    }}
                >
                    <div className="text-white text-center">
                        <div className="text-2xl mb-2">→</div>
                        <div className="text-sm opacity-80">
                            {pageOrder.next === '/' && 'Home'}
                            {pageOrder.next === '/upcoming' && 'Upcoming'}
                            {pageOrder.next === '/releases' && 'Releases'}
                        </div>
                    </div>
                </div>
            )}

            {/* Drag indicator */}
            {isDragging && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs">
                        {Math.abs(dragOffset) > window.innerWidth * 0.25 ? 'Release to navigate' : 'Keep dragging'}
                    </div>
                </div>
            )}

            {/* Page indicator dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-40">
                <div className={`w-2 h-2 rounded-full transition-all duration-200 ${pathname === '/upcoming' ? 'bg-white' : 'bg-white/40'}`} />
                <div className={`w-2 h-2 rounded-full transition-all duration-200 ${pathname === '/' ? 'bg-white' : 'bg-white/40'}`} />
                <div className={`w-2 h-2 rounded-full transition-all duration-200 ${pathname === '/releases' ? 'bg-white' : 'bg-white/40'}`} />
            </div>
        </div>
    );
}
