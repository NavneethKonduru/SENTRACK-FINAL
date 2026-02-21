/* ========================================
   SENTRAK — Offline Sync Hook
   Owner: Sharvesh (feat/assessment)
   ======================================== */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getSyncQueue, removeFromSyncQueue } from '../utils/offlineDB';

/**
 * useOfflineSync — manages offline/online sync state
 * Returns: { isOnline, pendingCount, lastSyncTime, syncNow, isSyncing }
 */
export default function useOfflineSync() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [pendingCount, setPendingCount] = useState(0);
    const [lastSyncTime, setLastSyncTime] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const syncInterval = useRef(null);

    // Listen for online/offline events
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

    // Check pending count periodically
    const refreshPendingCount = useCallback(async () => {
        try {
            const queue = await getSyncQueue();
            setPendingCount(queue.length);
        } catch (err) {
            console.error('[useOfflineSync] Error checking queue:', err);
        }
    }, []);

    useEffect(() => {
        refreshPendingCount();
        syncInterval.current = setInterval(refreshPendingCount, 10000); // check every 10s
        return () => clearInterval(syncInterval.current);
    }, [refreshPendingCount]);

    // Auto-sync when online and items are pending
    useEffect(() => {
        if (isOnline && pendingCount > 0 && !isSyncing) {
            syncNow();
        }
    }, [isOnline, pendingCount]);

    /**
     * Process sync queue  
     * For hackathon demo: saves to localStorage as sync simulation.
     * Architecture is ready for Firestore integration.
     */
    const syncNow = useCallback(async () => {
        if (isSyncing) return;
        setIsSyncing(true);

        try {
            const queue = await getSyncQueue();

            for (const item of queue) {
                try {
                    // Demo sync: mark as synced in localStorage
                    const synced = JSON.parse(localStorage.getItem('sentrak_synced') || '[]');
                    synced.push({
                        ...item,
                        syncStatus: 'synced',
                        syncedAt: Date.now(),
                    });
                    localStorage.setItem('sentrak_synced', JSON.stringify(synced));

                    // Remove from queue after successful sync
                    await removeFromSyncQueue(item.id);
                } catch (itemErr) {
                    console.error('[useOfflineSync] Failed to sync item:', item.id, itemErr);
                    // Continue with next item
                }
            }

            setLastSyncTime(Date.now());
            await refreshPendingCount();
        } catch (err) {
            console.error('[useOfflineSync] Sync error:', err);
        } finally {
            setIsSyncing(false);
        }
    }, [isSyncing, refreshPendingCount]);

    return {
        isOnline,
        pendingCount,
        lastSyncTime,
        syncNow,
        isSyncing,
    };
}
