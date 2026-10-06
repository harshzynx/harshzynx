import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 flex items-center gap-2.5 rounded-lg bg-amber-600 px-3.5 py-2 text-xs font-medium text-white shadow-xl backdrop-blur-md">
      <WifiOff className="h-4 w-4 animate-pulse" />
      <span>Offline Mode — Displaying cached portfolio content</span>
    </div>
  );
};
