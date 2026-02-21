# 📒 SENTRAK Change Ledger

> Auto-updated by each dev's Antigravity. Source of truth for all changes.

---

## Format

```
[TIMESTAMP] [DEV] [BRANCH] [TYPE] — Description
Types: FEAT | FIX | MERGE | BRANCH | SYNC | DESIGN | DATA
```

---

## Log

### Scaffold Phase

```
[14:45 IST] NAVNEETH main FEAT — Project scaffold pushed: Vite+React, design system, routing, 6 pages, dataShapes.js, firebase.js, layout components, teamhub files (28 files, 10K lines)
[16:40 IST] SHARVESH feat/assessment FEAT — sportMetrics.js: 12 sports + SAI_TESTS (8 standard tests) + SPORT_ICONS map
[16:45 IST] SHARVESH feat/assessment FEAT — SportSelector.jsx: 12-sport card grid with accent glow selection
[16:45 IST] SHARVESH feat/assessment FEAT — TimerWidget.jsx: precision stopwatch (performance.now, rAF, laps, vibration, 80px buttons)
[16:50 IST] SHARVESH feat/assessment FEAT — SAITestEngine.jsx: guided 8-test flow with countdown, timer/manual/BMI inputs, progress bar
[16:50 IST] SHARVESH feat/assessment FEAT — MetricsRecorder.jsx: dynamic sport-specific metrics (timer/manual/count/rating inputs)
[16:55 IST] SHARVESH feat/assessment FEAT — hashVerify.js: SHA-256 hash generation + verification (Web Crypto API)
[16:55 IST] SHARVESH feat/assessment FEAT — AttestationForm.jsx: 3-witness OTP verification with progress indicators
[17:00 IST] SHARVESH feat/assessment FEAT — offlineDB.js: IndexedDB storage (athletes, assessments, syncQueue stores)
[17:00 IST] SHARVESH feat/assessment FEAT — useOfflineSync.js: offline/online sync hook with auto-sync on reconnect
[17:05 IST] SHARVESH feat/assessment FEAT — fraudDetection.js: anomaly detection (impossible checks, z-score outliers, attestor reputation)
[17:05 IST] SHARVESH feat/assessment FEAT — VideoClipCapture.jsx: camera capture (15s max, MediaRecorder API, base64)
[17:10 IST] SHARVESH feat/assessment FEAT — RecordAssessment.jsx: full 7-step assessment page integrating all components
[17:10 IST] SHARVESH feat/assessment FEAT — ChallengeCard.jsx + Challenges.jsx: 5 seeded district challenges with filters
[17:15 IST] SHARVESH feat/assessment BRANCH — Tagged snapshot/assessment-v1 (all 14 files built and verified)
```

---

## Active Snapshot Branches (safe rollback points)

| Branch | Time  | Description                                         |
| ------ | ----- | --------------------------------------------------- |
| `main` | 14:45 | Scaffold — all pages render, design system complete |

---

## Compatibility Notes

> When you change something that affects OTHER devs, log it here so they adapt.

| Time  | Change                      | Affects | Action Required                              |
| ----- | --------------------------- | ------- | -------------------------------------------- |
| 14:45 | `dataShapes.js` created     | ALL     | Import shapes from `src/utils/dataShapes.js` |
| 14:45 | `index.css` design system   | ALL     | Use CSS classes only, no inline styles       |
| 14:45 | Routes defined in `App.jsx` | ALL     | Export default from your page files          |
