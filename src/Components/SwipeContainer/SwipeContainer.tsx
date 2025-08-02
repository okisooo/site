"use client";

import React from 'react';

interface SwipeContainerProps {
    children: React.ReactNode;
}

export default function SwipeContainer({ children }: SwipeContainerProps) {
    // Simply return the children without any swipe functionality
    return <>{children}</>;
}
