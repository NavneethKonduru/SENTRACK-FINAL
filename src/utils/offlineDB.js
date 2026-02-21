/* ========================================
   SENTRAK — IndexedDB Offline Storage
   Owner: Sharvesh (feat/assessment)
   Uses: idb library (in package.json)
   ======================================== */

import { openDB } from 'idb';

const DB_NAME = 'sentrak';
const DB_VERSION = 1;

let dbPromise = null;

/**
 * Initialize / open the IndexedDB database
 */
export function initDB() {
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                // Athletes store
                if (!db.objectStoreNames.contains('athletes')) {
                    db.createObjectStore('athletes', { keyPath: 'id' });
                }
                // Assessments store
                if (!db.objectStoreNames.contains('assessments')) {
                    const assessStore = db.createObjectStore('assessments', { keyPath: 'id' });
                    assessStore.createIndex('athleteId', 'athleteId', { unique: false });
                }
                // Sync queue store
                if (!db.objectStoreNames.contains('syncQueue')) {
                    db.createObjectStore('syncQueue', { keyPath: 'id' });
                }
            },
        });
    }
    return dbPromise;
}

// ─── Athletes ──────────────────────────────────────

export async function saveAthlete(athlete) {
    try {
        const db = await initDB();
        await db.put('athletes', athlete);
        return athlete;
    } catch (err) {
        console.error('[offlineDB] saveAthlete error:', err);
        throw err;
    }
}

export async function getAthlete(id) {
    try {
        const db = await initDB();
        return await db.get('athletes', id);
    } catch (err) {
        console.error('[offlineDB] getAthlete error:', err);
        return null;
    }
}

export async function getAllAthletes() {
    try {
        const db = await initDB();
        return await db.getAll('athletes');
    } catch (err) {
        console.error('[offlineDB] getAllAthletes error:', err);
        return [];
    }
}

// ─── Assessments ───────────────────────────────────

export async function saveAssessment(assessment) {
    try {
        const db = await initDB();
        await db.put('assessments', assessment);
        return assessment;
    } catch (err) {
        console.error('[offlineDB] saveAssessment error:', err);
        throw err;
    }
}

export async function getAssessmentsByAthlete(athleteId) {
    try {
        const db = await initDB();
        return await db.getAllFromIndex('assessments', 'athleteId', athleteId);
    } catch (err) {
        console.error('[offlineDB] getAssessmentsByAthlete error:', err);
        return [];
    }
}

export async function getAllAssessments() {
    try {
        const db = await initDB();
        return await db.getAll('assessments');
    } catch (err) {
        console.error('[offlineDB] getAllAssessments error:', err);
        return [];
    }
}

// ─── Sync Queue ────────────────────────────────────

export async function addToSyncQueue(item) {
    try {
        const db = await initDB();
        const entry = {
            ...item,
            id: item.id || crypto.randomUUID(),
            queuedAt: Date.now(),
        };
        await db.put('syncQueue', entry);
        return entry;
    } catch (err) {
        console.error('[offlineDB] addToSyncQueue error:', err);
        throw err;
    }
}

export async function getSyncQueue() {
    try {
        const db = await initDB();
        return await db.getAll('syncQueue');
    } catch (err) {
        console.error('[offlineDB] getSyncQueue error:', err);
        return [];
    }
}

export async function removeFromSyncQueue(id) {
    try {
        const db = await initDB();
        await db.delete('syncQueue', id);
    } catch (err) {
        console.error('[offlineDB] removeFromSyncQueue error:', err);
    }
}

export async function clearSyncQueue() {
    try {
        const db = await initDB();
        await db.clear('syncQueue');
    } catch (err) {
        console.error('[offlineDB] clearSyncQueue error:', err);
    }
}
