"use client";

import { useState, useEffect } from 'react';
import { useAdaptivePerformance } from '@/hooks/usePerformanceDetection';

interface PerformanceSettingsProps {
  className?: string;
}

export default function PerformanceSettings({ className = '' }: PerformanceSettingsProps) {
  const performance = useAdaptivePerformance();
  const [isOpen, setIsOpen] = useState(false);
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
      } catch (e) {
        console.warn('Failed to parse performance settings');
      }
    }
  }, []);

  const updateSetting = (key: keyof typeof userSettings, value: boolean) => {
    const newSettings = { ...userSettings, [key]: value };
    setUserSettings(newSettings);
    localStorage.setItem('performance-settings', JSON.stringify(newSettings));
    
    // Force page reload to apply settings
    window.location.reload();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`${className} fixed bottom-4 right-4 z-50 p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white transition-all`}
        title="Performance Settings"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="ui-card p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Performance Settings</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/70 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4 text-sm">
          <div className="p-3 rounded bg-white/5 border border-white/10">
            <h4 className="font-semibold text-white mb-2">Auto-detected:</h4>
            <ul className="space-y-1 text-white/70">
              <li>Device: {performance.isLowEnd ? 'Low-end' : 'Capable'}</li>
              <li>WebGL: {performance.supportsWebGL ? 'Supported' : 'Not supported'}</li>
              <li>Memory: {performance.deviceMemory}GB</li>
              <li>Connection: {performance.connectionSpeed}</li>
              {performance.batteryLevel && (
                <li>Battery: {Math.round(performance.batteryLevel * 100)}%</li>
              )}
            </ul>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-white">Force reduced effects</span>
              <input
                type="checkbox"
                checked={userSettings.forceReducedEffects}
                onChange={(e) => updateSetting('forceReducedEffects', e.target.checked)}
                className="rounded"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <span className="text-white">Force static backgrounds</span>
              <input
                type="checkbox"
                checked={userSettings.forceStaticBackgrounds}
                onChange={(e) => updateSetting('forceStaticBackgrounds', e.target.checked)}
                className="rounded"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <span className="text-white">Force simple navigation</span>
              <input
                type="checkbox"
                checked={userSettings.forceSimpleNavigation}
                onChange={(e) => updateSetting('forceSimpleNavigation', e.target.checked)}
                className="rounded"
              />
            </label>
          </div>

          <p className="text-xs text-white/50">
            Settings will apply after page reload. Auto-detection considers your device capabilities, 
            connection speed, and battery level.
          </p>
        </div>
      </div>
    </div>
  );
}
