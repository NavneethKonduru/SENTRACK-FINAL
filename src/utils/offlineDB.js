/* ========================================
   SENTRAK — IndexedDB Offline Storage Reliability
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
        }).catch(err => {
            console.warn('[OfflineDB] Initialization failed. Falling back to memory/localStorage operations.', err);
            dbPromise = null;
            return null;
        });
    }
    return dbPromise;
}

// ========================================
// MEMORY/LOCALSTORAGE FALLBACK UTILS
// ========================================

const getLocal = (key) => {
    try { return JSON.parse(localStorage.getItem(`sentrak_fallback_${key}`) || '[]'); }
    catch { return []; }
};

const setLocal = (key, data) => {
    try { localStorage.setItem(`sentrak_fallback_${key}`, JSON.stringify(data)); }
    catch (e) { console.warn('[OfflineDB] LocalStorage write failed', e); }
};

// ========================================
// Athletes
// ========================================

export async function saveAthlete(athlete) {
    try {
        const db = await initDB();
        if (!db) throw new Error('IDB unavailable');
        await db.put('athletes', athlete);
        return athlete;
    } catch (err) {
        console.warn('[offlineDB] saveAthlete IDB failed. Using fallback:', err);
        const athletes = getLocal('athletes');
        const idx = athletes.findIndex(a => a.id === athlete.id);
        if (idx >= 0) athletes[idx] = athlete;
        else athletes.push(athlete);
        setLocal('athletes', athletes);
        return athlete;
    }
}

export async function getAthlete(id) {
    try {
        const db = await initDB();
        if (!db) throw new Error('IDB unavailable');
        return await db.get('athletes', id);
    } catch (err) {
        console.warn('[offlineDB] getAthlete IDB failed. Using fallback:', err);
        return getLocal('athletes').find(a => a.id === id) || null;
    }
}

export async function getAllAthletes() {
    try {
        const db = await initDB();
        if (!db) throw new Error('IDB unavailable');
        return await db.getAll('athletes');
    } catch (err) {
        console.warn('[offlineDB] getAllAthletes IDB failed. Using fallback:', err);
        return getLocal('athletes');
    }
}

// ========================================
// Assessments
// ========================================

export async function saveAssessment(assessment) {
    try {
        const db = await initDB();
        if (!db) throw new Error('IDB unavailable');
        await db.put('assessments', assessment);
        return assessment;
    } catch (err) {
        console.warn('[offlineDB] saveAssessment IDB failed. Using fallback:', err);
        const assessments = getLocal('assessments');
        assessments.push(assessment);
        setLocal('assessments', assessments);
        return assessment;
    }
}

export async function getAssessmentsByAthlete(athleteId) {
    try {
        const db = await initDB();
        if (!db) throw new Error('IDB unavailable');
        return await db.getAllFromIndex('assessments', 'athleteId', athleteId);
    } catch (err) {
        console.warn('[offlineDB] getAssessmentsByAthlete IDB failed. Using fallback:', err);
        return getLocal('assessments').filter(a => a.athleteId === athleteId);
    }
}

export async function getAllAssessments() {
    try {
        const db = await initDB();
        if (!db) throw new Error('IDB unavailable');
        return await db.getAll('assessments');
    } catch (err) {
        console.warn('[offlineDB] getAllAssessments IDB failed. Using fallback:', err);
        return getLocal('assessments');
    }
}

// ========================================
// Sync Queue
// ========================================

export async function addToSyncQueue(item) {
    const entry = {
        ...item,
        id: item.id || crypto.randomUUID(),
        queuedAt: Date.now(),
    };

    try {
        const db = await initDB();
        if (!db) throw new Error('IDB unavailable');
        await db.put('syncQueue', entry);
        return entry;
    } catch (err) {
        console.warn('[offlineDB] addToSyncQueue IDB failed. Using fallback:', err);
        const q = getLocal('syncQueue');
        q.push(entry);
        setLocal('syncQueue', q);
        return entry;
    }
}

export async function getSyncQueue() {
    try {
        const db = await initDB();
        if (!db) throw new Error('IDB unavailable');
        return await db.getAll('syncQueue');
    } catch (err) {
        console.warn('[offlineDB] getSyncQueue IDB failed. Using fallback:', err);
        return getLocal('syncQueue');
    }
}

export async function removeFromSyncQueue(id) {
    try {
        const db = await initDB();
        if (!db) throw new Error('IDB unavailable');
        await db.delete('syncQueue', id);
    } catch (err) {
        console.warn('[offlineDB] removeFromSyncQueue IDB failed. Using fallback:', err);
        const q = getLocal('syncQueue').filter(i => i.id !== id);
        setLocal('syncQueue', q);
    }
}

export async function clearSyncQueue() {
    try {
        const db = await initDB();
        if (!db) throw new Error('IDB unavailable');
        await db.clear('syncQueue');
    } catch (err) {
        console.warn('[offlineDB] clearSyncQueue IDB failed. Using fallback:', err);
        setLocal('syncQueue', []);
    }
}
