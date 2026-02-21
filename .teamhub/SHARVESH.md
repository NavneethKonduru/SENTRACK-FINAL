# Sharvesh — ASSESSOR

## Role

SAI assessment engine, sport-specific metrics, timer, attestation, offline sync, fraud detection, challenges.

## Branch: `feat/assessment`

## Setup

```bash
git clone https://github.com/Shadow-Joker/IMPROV.git
cd IMPROV && npm install
git checkout -b feat/assessment
npm run dev
```

## My Files (ONLY touch these)

```
src/components/assessment/SAITestEngine.jsx
src/components/assessment/MetricsRecorder.jsx
src/components/assessment/TimerWidget.jsx
src/components/assessment/AttestationForm.jsx
src/components/assessment/VideoClipCapture.jsx
src/components/assessment/ChallengeCard.jsx
src/components/assessment/SportSelector.jsx
src/hooks/useOfflineSync.js
src/utils/offlineDB.js
src/utils/hashVerify.js
src/utils/fraudDetection.js
src/utils/sportMetrics.js
src/pages/RecordAssessment.jsx
src/pages/Challenges.jsx
```

## Page Exports

```javascript
// src/pages/RecordAssessment.jsx
export default function RecordAssessment() { ... }

// src/pages/Challenges.jsx
export default function Challenges() { ... }
```

## Task Checklist

- [ ] Clone + setup
- [ ] SportSelector + sportMetrics.js (12 sports)
- [ ] TimerWidget (stopwatch)
- [ ] SAITestEngine (8-test guided flow)
- [ ] MetricsRecorder (sport-specific)
- [ ] hashVerify.js (SHA-256)
- [ ] AttestationForm (3 witnesses)
- [ ] offlineDB.js (IndexedDB CRUD)
- [ ] useOfflineSync (sync queue)
- [ ] fraudDetection.js (anomaly flags)
- [ ] VideoClipCapture
- [ ] ChallengeCard + Challenges page
- [ ] RecordAssessment page
- [ ] Polish + responsive

## Sync Commands (every 2 hours)

```bash
git add . && git commit -m "progress: <what>" && git push origin feat/assessment
git pull origin main
```

---

## FULL ANTIGRAVITY PROMPT (paste this into your Antigravity session)

```
I'm Sharvesh on Team Flexinator building SENTRAK for NXTGEN'26 hackathon.
We're solving PS2: Grassroots Rural Athlete Talent Discovery Platform.

REPO: https://github.com/Shadow-Joker/IMPROV.git (already scaffolded on main)
MY BRANCH: feat/assessment

FIRST: Clone the repo, npm install, checkout feat/assessment, run dev server.

I own the ASSESSMENT ENGINE. These are MY files (do NOT touch other files):

src/components/assessment/SAITestEngine.jsx    — Guided SAI 8-test battery
src/components/assessment/MetricsRecorder.jsx  — Sport-specific metric entry
src/components/assessment/TimerWidget.jsx      — Built-in stopwatch (0.01s precision)
src/components/assessment/AttestationForm.jsx  — 3-witness OTP verification
src/components/assessment/VideoClipCapture.jsx — 15s video clip capture
src/components/assessment/ChallengeCard.jsx    — District challenge display card
src/components/assessment/SportSelector.jsx    — Sport picker + loads sport metrics
src/hooks/useOfflineSync.js                    — IndexedDB ↔ Firestore sync engine
src/utils/offlineDB.js                         — IndexedDB CRUD (idb library)
src/utils/hashVerify.js                        — SHA-256 tamper-proof hashing
src/utils/fraudDetection.js                    — Anomaly detection engine
src/utils/sportMetrics.js                      — 12 sport metric templates
src/pages/RecordAssessment.jsx                 — Full assessment recording page
src/pages/Challenges.jsx                       — District challenges listing page

CRITICAL DESIGN RULES:
1. Use CSS classes from src/index.css ONLY — no inline, no new CSS files
2. Import data shapes from src/utils/dataShapes.js — do NOT redefine
3. Dark premium theme with glassmorphism
4. Mobile-first responsive
5. Every page: export default function ComponentName()
6. Use React Router useParams, useNavigate

DATA SHAPES (from dataShapes.js):
const ASSESSMENT = {
  id: string,
  athleteId: string,
  sport: string,
  testType: string,       // "sai_30m" or "cricket_bowling_speed" etc
  testCategory: "sai"|"sport_specific",
  value: number,
  unit: string,           // "s", "m", "cm", "count", "km/h", "kg/m2", "rating"
  percentile: number,     // calculated vs benchmarks
  videoClipURL: string,   // base64 or blob URL
  hash: string,           // SHA-256 verification hash
  attestations: ATTESTATION[],
  flags: string[],        // fraud detection flags
  timestamp: number,
  syncStatus: "local"|"synced"
};

const ATTESTATION = {
  id: string,
  assessmentId: string,
  witnessName: string,
  witnessPhone: string,
  otpVerified: boolean,
  timestamp: number
};

const CHALLENGE = {
  id: string,
  title: string,          // "Fastest U-16 60m in Dharmapuri"
  sport: string,
  testType: string,
  ageGroup: "U-12"|"U-14"|"U-16"|"U-18"|"U-21",
  district: string,
  startDate: number,
  endDate: number,
  entries: { athleteId, value, attestationCount }[],
  status: "active"|"completed"
};

SPORT-SPECIFIC METRICS (sportMetrics.js):
Export an object keyed by sport name. Each sport has an array of metrics.
Each metric: { key, name, nameTamil, unit, inputType, benchmarks }
inputType: "timer" | "manual" | "count" | "rating"
benchmarks: { U12: { male: { good, excellent }, female: { good, excellent } }, U14: {...}, ... }

Sports to include (12):
1. Cricket: bowling_speed (km/h, manual), batting_distance (m, manual), fielding_reaction (s, timer)
2. Football: sprint_40m (s, timer), endurance_beep (level, manual), passing_accuracy (count out of 10, count), dribble_time (s, timer)
3. Kabaddi: raid_success (count, count), tackle_count (count, count), flexibility_score (cm, manual)
4. Hockey: sprint_30m (s, timer), dribble_slalom (s, timer), shot_accuracy (count/10, count), endurance_yo (level, manual)
5. Badminton: shuttle_run (s, timer), reaction_time (s, timer), smash_count_60s (count, count), footwork_test (s, timer)
6. Wrestling: pushups_60s (count, count), situps_60s (count, count), flexibility (cm, manual), weight (kg, manual)
7. Athletics_Track: 100m, 200m, 400m, 800m, 1500m (all timer, unit s)
8. Athletics_Field: long_jump (m), high_jump (m), shot_put (m), discus (m), javelin (m) (all manual)
9. Swimming: 50m_time (s, timer), 100m_time (s, timer), technique (1-5, rating)
10. Boxing: punch_count_30s (count), reaction_test (s, timer), endurance_3min (rating), weight (kg, manual)
11. Archery: score_10m (0-300, manual), score_20m (0-300, manual), score_30m (0-300, manual)
12. Weightlifting: snatch_max (kg, manual), clean_jerk_max (kg, manual), body_weight (kg, manual)

SAI TEST ENGINE (8 guided tests):
Step-by-step flow: select test → show instructions (text + visual) → preparation countdown (3...2...1) → START → timer/measurement → STOP → record value → hash → next test.
Tests: 30m Sprint, 60m Sprint, 600m Run, Standing Broad Jump, Vertical Jump, Shuttle Run 4×10m, Flexibility Sit-and-Reach, BMI (height+weight calc).

TIMER WIDGET:
- Large display: 00:00.00 (minutes:seconds.centiseconds)
- Giant START/STOP buttons (80px+ touch targets for village use)
- LAP button for multi-lap tests (600m, shuttle run)
- Records precise start/stop timestamps
- Vibration feedback on mobile (navigator.vibrate)
- Color changes: green (ready) → red (running) → blue (stopped)

ATTESTATION PROTOCOL:
- 3 witness slots, each: name input + phone input
- "Verify" button sends OTP (for hackathon demo: accept any 6-digit code)
- All 3 must verify → assessment gets "Community Verified ✓" badge
- Visual: green checkmarks appear as each witness verifies
- Store attestation data alongside assessment

HASH VERIFICATION (hashVerify.js):
generateHash(assessment): SHA-256 of (athleteId + testType + value + timestamp + witness1phone + witness2phone + witness3phone)
Use Web Crypto API: crypto.subtle.digest('SHA-256', data)
verifyHash(assessment, hash): recalculate and compare
Display: truncated hash on assessment card + "Verified ✓" or "Tampered ⚠️"

OFFLINE ENGINE (offlineDB.js + useOfflineSync.js):
offlineDB.js using idb library:
- openDB('sentrak', 1, { upgrade(db) { db.createObjectStore('athletes', {keyPath:'id'}); db.createObjectStore('assessments', {keyPath:'id'}); db.createObjectStore('syncQueue', {keyPath:'id'}); }})
- saveAthlete(athlete), getAthlete(id), getAllAthletes()
- saveAssessment(assessment), getAssessmentsByAthlete(id)
- addToSyncQueue(item), getSyncQueue(), removeSynced(id)
useOfflineSync hook:
- Checks navigator.onLine
- When online: processes syncQueue → saves to Firestore → marks synced
- Returns: { isOnline, pendingCount, syncNow() }

FRAUD DETECTION (fraudDetection.js):
checkAnomalies(assessment, benchmarks):
- Flag if value > 3 std devs from age-group mean
- Flag if value is physically impossible (e.g., 100m < 9.5s for U-14)
- Returns: { isAnomaly: bool, flags: string[], severity: "low"|"medium"|"high" }
checkAttestorReputation(phone, recentAttestations):
- Flag if same phone attested 20+ assessments in 24h
- Returns reputation score 0-100

DISTRICT CHALLENGES:
Seeded challenges data (for demo):
- "Fastest U-16 60m Sprint — Dharmapuri (Feb 2026)"
- "Longest U-14 Broad Jump — Salem (Feb 2026)"
- "Best U-18 Cricket Bowling Speed — Madurai (Feb 2026)"
ChallengeCard shows: title, sport, age group, district, deadline, current leader, entry count.
Challenges page: list of active challenges, click to see leaderboard.

Build production-quality. Premium dark UI. Giant touch targets for rural use.
Push to feat/assessment. Pull origin main before every push.
```
