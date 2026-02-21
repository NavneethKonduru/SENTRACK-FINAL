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

    // Initialize lastSyncTime from localStorage memory if available
    useEffect(() => {
        const storedLastSync = localStorage.getItem('sentrak_last_sync_time');
        if (storedLastSync) {
            setLastSyncTime(parseInt(storedLastSync, 10));
        }
    }, []);

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
            setPendingCount(Math.max(0, queue.length));
        } catch (err) {
            console.error('[useOfflineSync] Error checking queue:', err);
        }
    }, []);

    useEffect(() => {
        refreshPendingCount();
        // Poll every 5s while online, 15s while offline
        syncInterval.current = setInterval(refreshPendingCount, isOnline ? 5000 : 15000);
        return () => clearInterval(syncInterval.current);
    }, [refreshPendingCount, isOnline]);

    /**
     * Process sync queue  
     * For hackathon demo: saves to localStorage 'sentrak_synced' as server DB simulation.
     */
    const syncNow = useCallback(async () => {
        if (isSyncing || !isOnline) return;
        setIsSyncing(true);

        try {
            const queue = await getSyncQueue();
            if (queue.length === 0) {
                setIsSyncing(false);
                return;
            }

            // Process batch
            for (const item of queue) {
                try {
                    // Demo sync: push to 'server' localStorage
                    const synced = JSON.parse(localStorage.getItem('sentrak_synced') || '[]');
                    synced.push({
                        ...item,
                        syncStatus: 'synced',
                        syncedAt: Date.now(),
                    });
                    localStorage.setItem('sentrak_synced', JSON.stringify(synced));

                    // Successfully uploaded -> Remove from local pending sync queue
                    await removeFromSyncQueue(item.id);
                } catch (itemErr) {
                    console.error(`[useOfflineSync] Failed to sync item id:${item.id}`, itemErr);
                    // Auto-resume will retry this on next interval mapping
                }
            }

            // Update sync timestamps
            const nowMs = Date.now();
            setLastSyncTime(nowMs);
            localStorage.setItem('sentrak_last_sync_time', nowMs.toString());

            await refreshPendingCount();
        } catch (err) {
            console.error('[useOfflineSync] Global Sync error abort:', err);
        } finally {
            setIsSyncing(false);
        }
    }, [isSyncing, isOnline, refreshPendingCount]);

    // Auto-sync trigger whenever device comes online and has pending queue
    useEffect(() => {
        if (isOnline && pendingCount > 0 && !isSyncing) {
            // Small debounce before hammering the 'server'
            const autoSyncTimer = setTimeout(() => {
                syncNow();
            }, 2000);
            return () => clearTimeout(autoSyncTimer);
        }
    }, [isOnline, pendingCount, isSyncing, syncNow]);

    return {
        isOnline,
        pendingCount,
        lastSyncTime,
        syncNow,
        isSyncing,
    };
}
