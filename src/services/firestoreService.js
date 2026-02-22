/* ========================================
   SENTRAK — Firestore Cloud Service Layer
   Dual-write: IndexedDB (offline) + Firestore (cloud)
   ======================================== */

import { db } from '../firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore';

function queueForSync(type, data) {
  try {
    const queue = JSON.parse(localStorage.getItem('sentrak_fallback_syncQueue') || '[]');
    queue.push({ id: data.id || Date.now().toString(), type, data, timestamp: Date.now() });
    localStorage.setItem('sentrak_fallback_syncQueue', JSON.stringify(queue));
    console.log(`[Sync Engine] Queued ${type} for offline sync.`);
  } catch (err) {
    console.warn('[Sync Engine] Failed to queue offline item', err);
  }
}

// ========================================
// Users
// ========================================

export async function getUserProfile(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn('[Firestore] getUserProfile failed:', err);
    return null;
  }
}

export async function setUserProfile(uid, data) {
  try {
    await setDoc(doc(db, 'users', uid), { ...data, updatedAt: Date.now() }, { merge: true });
    return true;
  } catch (err) {
    console.warn('[Firestore] setUserProfile failed:', err);
    return false;
  }
}

// ========================================
// Athletes
// ========================================

export async function saveAthleteToCloud(athlete) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    queueForSync('athlete', athlete);
    return false;
  }
  try {
    await setDoc(doc(db, 'athletes', athlete.id), {
      ...athlete,
      updatedAt: Date.now(),
    });
    return true;
  } catch (err) {
    console.warn('[Firestore] saveAthlete failed, queueing offline:', err);
    queueForSync('athlete', athlete);
    return false;
  }
}

export async function getAthleteFromCloud(id) {
  try {
    const snap = await getDoc(doc(db, 'athletes', id));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn('[Firestore] getAthlete failed:', err);
    return null;
  }
}

export async function getAllAthletesFromCloud() {
  try {
    const snap = await getDocs(collection(db, 'athletes'));
    return snap.docs.map(d => d.data());
  } catch (err) {
    console.warn('[Firestore] getAllAthletes failed:', err);
    return [];
  }
}

// Aliases for build compatibility
export const getAthleteById = getAthleteFromCloud;
export const getCloudAthletes = getAllAthletesFromCloud;

export async function getAthletesByCoach(coachUid) {
  try {
    const q = query(collection(db, 'athletes'), where('registeredBy', '==', coachUid));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data());
  } catch (err) {
    console.warn('[Firestore] getAthletesByCoach failed:', err);
    return [];
  }
}

// ========================================
// Assessments
// ========================================

export async function saveAssessmentToCloud(assessment) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    queueForSync('assessment', assessment);
    return false;
  }
  try {
    await setDoc(doc(db, 'assessments', assessment.id), {
      ...assessment,
      updatedAt: Date.now(),
    });
    return true;
  } catch (err) {
    console.warn('[Firestore] saveAssessment failed, queueing offline:', err);
    queueForSync('assessment', assessment);
    return false;
  }
}

export async function getAssessmentsByAthleteCloud(athleteId) {
  try {
    const q = query(collection(db, 'assessments'), where('athleteId', '==', athleteId));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data());
  } catch (err) {
    console.warn('[Firestore] getAssessmentsByAthlete failed:', err);
    return [];
  }
}

export const getAssessmentsByAthleteId = getAssessmentsByAthleteCloud;

// ========================================
// Certificates (SenPass)
// ========================================

export async function saveCertificateToCloud(cert) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    queueForSync('certificate', cert);
    return false;
  }
  try {
    await setDoc(doc(db, 'certificates', cert.id), { ...cert, updatedAt: Date.now() });
    return true;
  } catch (err) {
    console.warn('[Firestore] saveCertificate failed, queueing offline:', err);
    queueForSync('certificate', cert);
    return false;
  }
}

export async function getCertificateById(certId) {
  try {
    const snap = await getDoc(doc(db, 'certificates', certId));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn('[Firestore] getCertificate failed:', err);
    return null;
  }
}

export async function getCertificatesByAthlete(athleteId) {
  try {
    const q = query(collection(db, 'certificates'), where('athleteId', '==', athleteId));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data());
  } catch (err) {
    console.warn('[Firestore] getCertsByAthlete failed:', err);
    return [];
  }
}

// ========================================
// Sync Engine — Drain offline queue to cloud
// ========================================

export async function syncOfflineQueue() {
  try {
    const queue = JSON.parse(localStorage.getItem('sentrak_fallback_syncQueue') || '[]');
    if (queue.length === 0) return { synced: 0 };

    let synced = 0;
    for (const item of queue) {
      try {
        if (item.type === 'athlete') {
          await saveAthleteToCloud(item.data);
        } else if (item.type === 'assessment') {
          await saveAssessmentToCloud(item.data);
        } else if (item.type === 'certificate') {
          await saveCertificateToCloud(item.data);
        }
        synced++;
      } catch (err) {
        console.warn(`[Sync] Failed to sync item ${item.id}:`, err);
      }
    }

    // Clear synced items
    if (synced === queue.length) {
      localStorage.setItem('sentrak_fallback_syncQueue', '[]');
    }

    return { synced, total: queue.length };
  } catch (err) {
    console.warn('[Sync] syncOfflineQueue failed:', err);
    return { synced: 0, error: err.message };
  }
}

export async function pullCloudDataToLocal() {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return;
  try {
    const cloudAthletes = await getAllAthletesFromCloud();
    if (cloudAthletes.length > 0) {
      const local = JSON.parse(localStorage.getItem('sentrak_athletes') || '[]');
      const localIds = new Set(local.map(a => a.id));
      
      const newCloud = cloudAthletes.filter(a => !localIds.has(a.id));
      
      // Update local storage with any net-new athletes from other devices
      if (newCloud.length > 0) {
        localStorage.setItem('sentrak_athletes', JSON.stringify([...local, ...newCloud]));
        console.log(`[Sync] Pulled ${newCloud.length} cloud athletes downward into local cache.`);
      }
    }
  } catch (err) {
    console.warn('[Sync] Failed to pull cloud data:', err);
  }
}

