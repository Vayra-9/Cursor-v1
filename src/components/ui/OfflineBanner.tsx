import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle, X } from 'lucide-react';
import { isOnline, getOfflineQueueSize, triggerSync } from '@/utils/offlineSync';

interface OfflineBannerProps {
  className?: string;
}

const OfflineBanner: React.FC<OfflineBannerProps> = ({ className = '' }) => {
  const [online, setOnline] = useState(true);
  const [queueSize, setQueueSize] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    // Check initial online status
    setOnline(isOnline());

    // Listen for online/offline events
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for sync complete events
    const handleSyncComplete = (event: CustomEvent) => {
      setIsSyncing(false);
      setLastSyncTime(new Date());
      setQueueSize(0);
    };

    window.addEventListener('offlineSyncComplete', handleSyncComplete as EventListener);

    // Update queue size periodically
    const updateQueueSize = async () => {
      try {
        const size = await getOfflineQueueSize();
        setQueueSize(size);
        setShowBanner(!online || size > 0);
      } catch (error) {
        console.error('Failed to get queue size:', error);
      }
    };

    updateQueueSize();
    const interval = setInterval(updateQueueSize, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('offlineSyncComplete', handleSyncComplete as EventListener);
      clearInterval(interval);
    };
  }, [online]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await triggerSync();
    } catch (error) {
      console.error('Failed to trigger sync:', error);
      setIsSyncing(false);
    }
  };

  const formatLastSync = () => {
    if (!lastSyncTime) return 'Never';
    const now = new Date();
    const diff = now.getTime() - lastSyncTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
        className={`
          fixed top-0 left-0 right-0 z-50
          ${className}
        `}
      >
        <div className={`
          px-4 py-3 shadow-lg
          ${online 
            ? 'bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800' 
            : 'bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800'
          }
        `}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Status Icon */}
              <div className={`
                p-1.5 rounded-full
                ${online 
                  ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400' 
                  : 'bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-400'
                }
              `}>
                {online ? (
                  <Wifi size={16} />
                ) : (
                  <WifiOff size={16} />
                )}
              </div>

              {/* Status Text */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className={`
                  text-sm font-medium
                  ${online 
                    ? 'text-blue-800 dark:text-blue-200' 
                    : 'text-amber-800 dark:text-amber-200'
                  }
                `}>
                  {online ? 'You are online' : 'You are offline'}
                </span>

                {/* Queue Size */}
                {queueSize > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {queueSize} action{queueSize !== 1 ? 's' : ''} pending sync
                    </span>
                    {lastSyncTime && (
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        Last sync: {formatLastSync()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {queueSize > 0 && online && (
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
                    transition-colors
                    ${isSyncing
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }
                  `}
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={14} />
                      Sync Now
                    </>
                  )}
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={() => setShowBanner(false)}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close banner"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Progress Bar for Syncing */}
          {isSyncing && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              className="absolute bottom-0 left-0 h-1 bg-blue-500"
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OfflineBanner;
