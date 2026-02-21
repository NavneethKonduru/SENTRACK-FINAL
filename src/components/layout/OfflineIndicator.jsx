import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnect, setShowReconnect] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnect(true);
      setTimeout(() => setShowReconnect(false), 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnect(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnect) return null;

  return (
    <div className="offline-banner" style={showReconnect ? { background: 'linear-gradient(90deg, var(--accent-success), #059669)' } : {}}>
      {isOnline ? (
        <>
          <Wifi size={16} />
          <span>Back online — syncing data...</span>
        </>
      ) : (
        <>
          <WifiOff size={16} />
          <span>Offline mode — data saved locally</span>
        </>
      )}
    </div>
  );
}
