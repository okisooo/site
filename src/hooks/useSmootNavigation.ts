"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface NavigationState {
  isTransitioning: boolean;
  direction: number;
}

export const useSmootNavigation = () => {
  const router = useRouter();
  const [navState, setNavState] = useState<NavigationState>({
    isTransitioning: false,
    direction: 0,
  });

  const navigateWithTransition = (
    to: string,
    direction: number = 0,
    delay: number = 100
  ) => {
    if (navState.isTransitioning) return;

    setNavState({ isTransitioning: true, direction });

    // Add a slight delay for better UX
    setTimeout(() => {
      router.push(to);
      
      // Reset transition state after navigation
      setTimeout(() => {
        setNavState({ isTransitioning: false, direction: 0 });
      }, 700); // Slightly longer than transition duration
    }, delay);
  };

  return {
    navigateWithTransition,
    isTransitioning: navState.isTransitioning,
    direction: navState.direction,
  };
};
