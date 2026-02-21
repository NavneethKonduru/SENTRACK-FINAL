# MEGA PROMPT — FINAL NIGHT BUILD

## Auth + Database + SenPass Vault + Settings + Chatbot + OTP Fix

> **Paste this into a NEW Antigravity session, Windsurf, Cursor, or any AI coding agent.**
> **Can be run from StackBlitz (stackblitz.com/github/Shadow-Joker/IMPROV) or locally.**

```
I'm building SENTRAK, a grassroots athlete discovery PWA for NXTGEN'26 hackathon.
The core app (registration, assessment, scout dashboard) is BUILT and on main.
This is the FINAL BUILD NIGHT. I need ALL of the following implemented in one session.

REPO: https://github.com/Shadow-Joker/IMPROV.git
BRANCH: feat/final-night (new branch from latest main)

═══════════════════════════════════════════════════════════════
                    RULES
═══════════════════════════════════════════════════════════════
- git clone, npm install, git checkout -b feat/final-night, npm run dev
- Commit + push after EACH completed task
- DO NOT STOP until all tasks are done
- This is a React 18 + Vite + Firebase PWA
- Design system is in index.css — use the existing CSS variables and classes
- All new pages must use the existing Layout component and design language

═══════════════════════════════════════════════════════════════
TASK 1: FIREBASE PHONE AUTH + ROLE-BASED ACCESS (Priority #1)
═══════════════════════════════════════════════════════════════

### 1A: Auth Context + Login Page

Create src/contexts/AuthContext.jsx:
- AuthProvider wraps the app
- Uses Firebase Phone Auth (import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth')
- State: { user, role, loading, login, logout }
- On login success, check Firestore 'users' collection for role
- If new user, default role = 'athlete'
- Expose: useAuth() hook

Create src/pages/Login.jsx:
- Phone number input (Indian format: +91 XXXXXXXXXX)
- "Send OTP" button → Firebase sends real SMS
- 6-digit OTP input (6 separate boxes, auto-focus next)
- On verify → set user state → redirect to role-appropriate dashboard
- Beautiful dark theme matching existing design (use var(--bg-primary), var(--accent-primary), etc.)
- Add invisible reCAPTCHA div for Firebase Phone Auth

### 1B: Role Selection (first-time users)

Create src/pages/RoleSelect.jsx:
- After first login, show 3 role cards:
  1. 🏃 Athlete — "View your profile, track progress, see scheme matches"
  2. 🏫 Coach — "Register athletes, record assessments, manage your team"
  3. 🔍 Scout — "Discover talent, search athletes, make offers"
- Each card is a glassmorphic card with icon, title, description
- On select → write to Firestore: users/{uid} = { phone, role, createdAt }
- Redirect to appropriate dashboard

### 1C: Protected Routes

Modify src/App.jsx:
- Wrap all routes in AuthProvider
- Create ProtectedRoute component that checks:
  - If not logged in → redirect to /login
  - If role doesn't match → redirect to appropriate dashboard
- Route access:
  - /login, /select-role → public
  - /register, /assess/* → coach only
  - /scout → scout only
  - /profile/:id → athlete (own profile) + coach (own athletes) + scout (verified only)
  - /settings → all authenticated users
  - / (landing) → public

### 1D: Role-Based Navigation

Modify src/components/layout/BottomNav.jsx:
- Show different nav items based on role:
  - Athlete: Home, My Profile, Schemes, Settings
  - Coach: Home, Register, Assess, My Athletes, Settings
  - Scout: Home, Search, Heat Map, Offers, Settings
- Highlight active route
- Show user avatar/initial in the corner

═══════════════════════════════════════════════════════════════
TASK 2: FIRESTORE DATABASE INTEGRATION (Priority #1)
═══════════════════════════════════════════════════════════════

Currently all data is in localStorage. Migrate to Firestore with offline fallback.

### 2A: Firestore Service Layer

Create src/services/firestoreService.js:
```

import { db } from '../firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

// Athletes
export async function saveAthleteToCloud(athlete) {
await setDoc(doc(db, 'athletes', athlete.id), {
...athlete,
updatedAt: Date.now(),
});
}

export async function getAthleteFromCloud(id) {
const snap = await getDoc(doc(db, 'athletes', id));
return snap.exists() ? snap.data() : null;
}

export async function getAthletesByCoach(coachUid) {
const q = query(collection(db, 'athletes'), where('registeredBy', '==', coachUid));
const snap = await getDocs(q);
return snap.docs.map(d => d.data());
}

// Assessments
export async function saveAssessmentToCloud(assessment) {
await setDoc(doc(db, 'assessments', assessment.id), {
...assessment,
updatedAt: Date.now(),
});
}

export async function getAssessmentsByAthlete(athleteId) {
const q = query(collection(db, 'assessments'), where('athleteId', '==', athleteId));
const snap = await getDocs(q);
return snap.docs.map(d => d.data());
}

// Certificates (SenPass Vault)
export async function saveCertificate(cert) {
await setDoc(doc(db, 'certificates', cert.id), cert);
}

// Users
export async function getUserProfile(uid) {
const snap = await getDoc(doc(db, 'users', uid));
return snap.exists() ? snap.data() : null;
}

export async function setUserProfile(uid, data) {
await setDoc(doc(db, 'users', uid), data, { merge: true });
}

```

### 2B: Dual-Write Strategy

Modify src/utils/offlineDB.js — for EACH save function:
1. Write to IndexedDB/localStorage first (instant, works offline)
2. THEN try to write to Firestore (async, may fail offline)
3. If Firestore fails, add to syncQueue
4. On app mount, check navigator.onLine — if online, drain syncQueue

This means the app works offline AND syncs when online. Best of both worlds.

### 2C: Sync Engine

Create src/services/syncEngine.js:
- On mount: window.addEventListener('online', syncAll)
- syncAll(): get all items from syncQueue → write to Firestore → remove from queue
- Show a "Syncing..." toast when syncing
- Show "All synced ✓" toast when done
- Show offline indicator badge when navigator.onLine === false

═══════════════════════════════════════════════════════════════
TASK 3: SENPASS VAULT — Verified Certificate System
═══════════════════════════════════════════════════════════════

### 3A: Certificate Generation

Create src/utils/senpass.js:
```

import { generateHash } from './hashVerify';

export async function generateSenPass(athlete, assessments, attestations) {
const certId = 'SP-' + crypto.randomUUID().split('-')[0].toUpperCase();

const certData = {
id: certId,
athleteId: athlete.id,
athleteName: athlete.name,
sport: athlete.sport,
district: athlete.district,
age: athlete.age,
gender: athlete.gender,
assessments: assessments.map(a => ({
testType: a.testType,
value: a.value,
unit: a.unit,
timestamp: a.timestamp,
})),
witnessCount: attestations.length,
witnesses: attestations.map(a => ({
name: a.witnessName,
phone: a.witnessPhone?.slice(-4), // last 4 digits only
verified: a.otpVerified,
})),
issuedAt: Date.now(),
tier: calculateTier(assessments, attestations),
};

certData.hash = await generateHash(certData);
certData.qrData = JSON.stringify({
id: certId,
hash: certData.hash,
verify: `https://sentrak.vercel.app/verify/${certId}`,
});

return certData;
}

function calculateTier(assessments, attestations) {
const verifiedCount = attestations.filter(a => a.otpVerified).length;
const hasVideo = assessments.some(a => a.videoClip);
const noAnomalies = assessments.every(a => !a.anomalyFlags?.length);

if (verifiedCount >= 3 && hasVideo && noAnomalies) return 'gold';
if (verifiedCount >= 3 && noAnomalies) return 'silver';
if (verifiedCount >= 1) return 'bronze';
return 'basic';
}

```

### 3B: SenPass Card Component

Create src/components/senpass/SenPassCard.jsx:
- Premium card design (glassmorphic, dark theme)
- Top: "SenPass" logo + tier badge (🥉 Bronze / 🥈 Silver / 🥇 Gold)
- Athlete photo (circular), name, sport, district, age
- Assessment results table (test, value, percentile)
- Bottom: QR code (qrcode.react) linking to verification URL
- Hash fingerprint: show first 8 + "..." + last 4 chars
- "Download as Image" button (use html2canvas to capture card as PNG)
- Witness section: "Verified by 3 community witnesses ✓"
- Issued date in human-readable format

### 3C: SenPass Vault Page

Create src/pages/SenPassVault.jsx:
- Route: /senpass/:athleteId
- Lists all certificates for this athlete
- Each cert is a mini SenPassCard
- "Generate New SenPass" button (only for coaches with assessed athletes)
- Tier filter: All / Gold / Silver / Bronze

### 3D: Verification Page

Create src/pages/VerifySenPass.jsx:
- Route: /verify/:certId
- PUBLIC page (no login required — anyone can verify!)
- Loads certificate from Firestore by certId
- Re-generates hash from stored data
- Compares against stored hash
- Shows:
  - ✅ "VERIFIED — This SenPass is authentic" (green, with animation)
  - ❌ "TAMPERED — Data integrity check failed" (red, warning)
- Displays the full certificate data so verifier can see what's attested
- Beautiful, trustworthy design — this is what government officials see

═══════════════════════════════════════════════════════════════
TASK 4: SETTINGS PAGE + LANGUAGE IN PROFILE
═══════════════════════════════════════════════════════════════

Create src/pages/Settings.jsx:
- Route: /settings

Sections:
1. **Profile**
   - Avatar (from camera or initials)
   - Display name (editable)
   - Phone number (read-only, from auth)
   - Organization (editable text, e.g. "Salem District School")
   - Role badge (shows current role)

2. **Language**
   - Tamil / English toggle switch (styled like iOS)
   - When switched: update localStorage('sentrak_language')
   - ALL UI text should switch immediately via translations.js
   - Label: "மொழி / Language"
   - Remove any floating LanguageToggle from other pages

3. **Notifications**
   - Push notifications toggle
   - Assessment reminders toggle

4. **Data Management**
   - "Export My Data" → downloads JSON file
   - Storage usage display (X athletes, Y assessments)
   - "Clear Local Cache" with confirmation dialog
   - Sync status: "Last synced: 5 min ago" or "Offline — will sync when connected"

5. **About**
   - Version: 1.0.0
   - "SENTRAK — Grassroots Talent Discovery"
   - Link to team credits
   - Logout button (red, with confirmation)

═══════════════════════════════════════════════════════════════
TASK 5: FIX OTP — USE GENERATED CODES
═══════════════════════════════════════════════════════════════

Modify src/components/assessment/AttestationForm.jsx:

Current problem: Any 6-digit code works. Fix:

1. In handleSendOTP(index):
   - Generate a random 6-digit code: Math.floor(100000 + Math.random() * 900000)
   - Store it: updateWitness(index, 'generatedOTP', code.toString())
   - Show a modal/popup: "OTP for witness: [CODE]. Show this on their device."
   - The modal should explain: "Ask the witness to enter this code on their phone"
   - Start a 30-second countdown for resend

2. In handleVerifyOTP(index):
   - Compare EXACT match: w.otp === w.generatedOTP
   - If wrong: shake animation on OTP boxes + "Incorrect OTP" error
   - If right: checkmark animation + green border + haptic
   - After 3 failed attempts: regenerate OTP

3. Add visual indicator when OTP is sent:
   - Witness card shows "OTP Sent ✓ — Valid for 5 minutes"
   - Timer counting down

═══════════════════════════════════════════════════════════════
TASK 6: VOICE CHATBOT — SENBOT
═══════════════════════════════════════════════════════════════

### 6A: Chat Engine

Create src/components/chatbot/SenBot.jsx:
- Floating action button (bottom-right, above BottomNav)
- Mic icon + "Ask SenBot" tooltip
- On tap: opens a chat panel (slides up from bottom, 60% height)
- Chat panel has:
  - Message history (scrollable)
  - Text input + mic button
  - Quick action chips: "Register", "Assess", "My Profile", "Schemes", "Help"

### 6B: Intent Classification

Create src/utils/chatIntents.js:
```

const INTENTS = [
// Navigation
{ keywords: ['register', 'signup', 'new athlete', 'add athlete', 'பதிவு'],
action: 'navigate', target: '/register',
response: 'Taking you to athlete registration...' },
{ keywords: ['assess', 'test', 'timer', 'record', 'measure', 'பரிசோதனை'],
action: 'navigate', target: '/assess',
response: 'Opening the assessment page...' },
{ keywords: ['scout', 'search', 'find', 'discover', 'talent', 'தேடு'],
action: 'navigate', target: '/scout',
response: 'Opening the Scout Dashboard...' },
{ keywords: ['profile', 'my profile', 'passport', 'senpass', 'சுயவிவரம்'],
action: 'navigate', target: '/profile',
response: 'Loading your profile...' },
{ keywords: ['scheme', 'scholarship', 'fund', 'money', 'grant', 'உதவித்தொகை'],
action: 'navigate', target: '/schemes',
response: 'Checking available government schemes...' },
{ keywords: ['setting', 'language', 'tamil', 'english', 'அமைப்பு'],
action: 'navigate', target: '/settings',
response: 'Opening settings...' },
{ keywords: ['challenge', 'competition', 'district', 'போட்டி'],
action: 'navigate', target: '/challenges',
response: 'Showing district challenges...' },

// Queries
{ keywords: ['how many', 'count', 'total', 'athletes registered'],
action: 'query', handler: 'countAthletes',
response: '' },
{ keywords: ['what is', 'explain', 'help', 'how to', 'உதவி'],
action: 'help', handler: 'showHelp',
response: '' },
{ keywords: ['rating', 'score', 'talent', 'rank'],
action: 'query', handler: 'showRating',
response: '' },
{ keywords: ['offline', 'sync', 'connected', 'internet'],
action: 'query', handler: 'checkStatus',
response: '' },

// Greetings
{ keywords: ['hi', 'hello', 'hey', 'vanakkam', 'வணக்கம்'],
action: 'greet',
response: 'Vanakkam! 🙏 I\'m SenBot. I can help you navigate SENTRAK, find schemes, or answer questions. What do you need?' },
];

export function classifyIntent(input) {
const lower = input.toLowerCase().trim();
for (const intent of INTENTS) {
if (intent.keywords.some(k => lower.includes(k))) return intent;
}
return { action: 'unknown', response: 'I didn\'t understand that. Try: "register athlete", "show my profile", or "find schemes".' };
}

```

### 6C: Voice I/O

- **Voice Input**: Use Web Speech API (SpeechRecognition)
  - Support 'en-IN' and 'ta-IN' based on language setting
  - Show pulsing mic animation while listening
  - Auto-stop after 3 seconds of silence

- **Voice Output**: Use SpeechSynthesis API
  - Speak responses in the selected language
  - Don't speak if user typed (only speak if voice input was used)

### 6D: Query Handlers

For 'query' intents, implement handlers:
- countAthletes: read localStorage, return count
- showRating: get current user's athlete profile, speak rating & tier
- checkStatus: navigator.onLine status + sync queue length

═══════════════════════════════════════════════════════════════
                    EXECUTION ORDER
═══════════════════════════════════════════════════════════════

1. Clone → install → branch feat/final-night → npm run dev
2. TASK 1: Auth (login + roles + protected routes) → commit + push
3. TASK 2: Firestore service layer + dual-write → commit + push
4. TASK 3: SenPass Vault (cert generation + card + vault page + verify) → commit + push
5. TASK 4: Settings page → commit + push
6. TASK 5: OTP fix → commit + push
7. TASK 6: SenBot chatbot → commit + push
8. Tag: snapshot/final-night-complete

DO NOT STOP. DO NOT ASK. Build, commit, push, continue.
Every file must use the existing design system (var(--bg-primary), var(--accent-primary), etc).
Every component must be dark-themed, glassmorphic, premium.
```
