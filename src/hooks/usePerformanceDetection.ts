"use client";

import { useState, useEffect } from 'react';

interface PerformanceMetrics {
  isLowEnd: boolean;
  supportsWebGL: boolean;
  supportsBackdropFilter: boolean;
  deviceMemory: number;
  connectionSpeed: 'slow' | 'fast' | 'unknown';
  reducedMotion: boolean;
  batteryLevel?: number;
  isCharging?: boolean;
}

export function usePerformanceDetection(): PerformanceMetrics {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    isLowEnd: false,
    supportsWebGL: true,
    supportsBackdropFilter: true,
    deviceMemory: 4,
    connectionSpeed: 'unknown',
    reducedMotion: false,
  });

  useEffect(() => {
    const detectPerformance = async () => {
      // Check for reduced motion preference
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Check WebGL support
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const supportsWebGL = !!gl;

      // Check backdrop-filter support
      const supportsBackdropFilter = CSS.supports('backdrop-filter', 'blur(1px)') || 
                                    CSS.supports('-webkit-backdrop-filter', 'blur(1px)');

      // Get device memory (if available)
      const navigatorWithMemory = navigator as Navigator & { deviceMemory?: number };
      const deviceMemory = navigatorWithMemory.deviceMemory || 4;

      // Check connection speed
      const navigatorWithConnection = navigator as Navigator & {
        connection?: { effectiveType: string };
        mozConnection?: { effectiveType: string };
        webkitConnection?: { effectiveType: string };
      };
      const connection = navigatorWithConnection.connection || navigatorWithConnection.mozConnection || navigatorWithConnection.webkitConnection;
      let connectionSpeed: 'slow' | 'fast' | 'unknown' = 'unknown';
      
      if (connection) {
        const effectiveType = connection.effectiveType;
        connectionSpeed = ['slow-2g', '2g', '3g'].includes(effectiveType) ? 'slow' : 'fast';
      }

      // Detect low-end devices
      const isLowEnd = (
        deviceMemory <= 2 ||
        !supportsWebGL ||
        connectionSpeed === 'slow' ||
        /Android.*[2-4]\./i.test(navigator.userAgent) ||
        /iPhone.*OS [5-9]_/i.test(navigator.userAgent)
      );

      // Battery API (experimental)
      let batteryLevel: number | undefined;
      let isCharging: boolean | undefined;
      
      try {
        const navigatorWithBattery = navigator as Navigator & {
          getBattery?: () => Promise<{ level: number; charging: boolean }>;
        };
        const battery = await navigatorWithBattery.getBattery?.();
        if (battery) {
          batteryLevel = battery.level;
          isCharging = battery.charging;
        }
      } catch {
        // Battery API not supported
      }

      setMetrics({
        isLowEnd,
        supportsWebGL,
        supportsBackdropFilter,
        deviceMemory,
        connectionSpeed,
        reducedMotion,
        batteryLevel,
        isCharging,
      });
    };

    detectPerformance();

    // Listen for changes in reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      setMetrics(prev => ({ ...prev, reducedMotion: mediaQuery.matches }));
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return metrics;
}

// Hook for component-level performance decisions
export function useAdaptivePerformance() {
  const metrics = usePerformanceDetection();
  const [userSettings, setUserSettings] = useState({
    forceReducedEffects: false,
    forceStaticBackgrounds: false,
    forceSimpleNavigation: false,
  });

  useEffect(() => {
    // Load user preferences from localStorage
    const saved = localStorage.getItem('performance-settings');
    if (saved) {
      try {
        setUserSettings(JSON.parse(saved));
      } catch {
        console.warn('Failed to parse performance settings');
      }
    }
  }, []);
  
  return {
    ...metrics,
    // Recommended settings based on performance + user preferences
    shouldUseReducedEffects: userSettings.forceReducedEffects || metrics.isLowEnd || metrics.reducedMotion,
    shouldDisableAnimations: metrics.reducedMotion || (metrics.batteryLevel !== undefined && metrics.batteryLevel < 0.2 && !metrics.isCharging),
    shouldUseStaticBackgrounds: userSettings.forceStaticBackgrounds || metrics.isLowEnd || !metrics.supportsWebGL,
    shouldReduceParticles: metrics.isLowEnd || metrics.connectionSpeed === 'slow',
    shouldSimplifyNavigation: userSettings.forceSimpleNavigation || metrics.deviceMemory <= 2,
  };
}
