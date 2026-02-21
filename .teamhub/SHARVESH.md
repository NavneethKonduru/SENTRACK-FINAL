# Sharvesh — PHASE 2: POLISH & PRECISION

## Status: ✅ Phase 1 DONE → Phase 2: Full Polish + WOW Factor

## Branch: `feat/assessment-v2`

---

## FULL ANTIGRAVITY PROMPT — PHASE 2 (paste into NEW Antigravity session)

```
I'm Sharvesh on Team Flexinator building SENTRAK for NXTGEN'26 hackathon.
MY PHASE 1 IS DONE — all 14 assessment files are built and merged.
Now PHASE 2: precision polish, bug fixing, and making the assessment engine jaw-dropping.

REPO: https://github.com/Shadow-Joker/IMPROV.git
MY BRANCH: feat/assessment-v2 (new branch from latest main)
I MUST NOT touch files outside my ownership list.

═══════════════════════════════════════════════════════════════
                    AUTONOMOUS WORKFLOW RULES
═══════════════════════════════════════════════════════════════

RULE 1 — GIT SETUP
  git clone https://github.com/Shadow-Joker/IMPROV.git
  cd IMPROV && npm install
  git checkout -b feat/assessment-v2
  npm run dev

RULE 2 — GIT DISCIPLINE
  After EACH file improved: git add -A && git commit -m "polish(assessment): <what>" && git push origin feat/assessment-v2
  After every 3rd commit: git tag snapshot/assessment-v2-p<N> && git push origin --tags
  Every 2 hours: git pull origin main && merge

RULE 3 — CHANGELOG: append after every push.
RULE 4 — CONTINUOUS. Do NOT stop until all tasks done.

═══════════════════════════════════════════════════════════════
   PHASE 2: DETAILED LINE-BY-LINE IMPROVEMENTS
   REASON for every change is explained.
═══════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────
TASK 1: src/utils/sportMetrics.js — ACCURACY AUDIT
────────────────────────────────────────────────────────
WHY: If a judge asks "are these real metrics?" and the units or ranges
are wrong, we lose all credibility. Every metric must be sport-accurate.

WHAT TO DO:
1. Verify EVERY metric has correct unit:
   - Sprint times: seconds (s), NOT milliseconds
   - Distances: meters (m) for jumps, centimeters (cm) for flexibility
   - Speeds: km/h (not mph)
   - Counts: pure numbers
   - Ratings: 1-5 scale
2. Add benchmark ranges to each metric for percentile calculation:
   Each metric needs: { ...existing, benchmarks: { U12: { male: { avg, good, excellent }, female: {...} }, U14: {...}, ... } }
   Use realistic values. For example:
   - 100m U-16 male: avg=13.5s, good=12.5s, excellent=11.8s
   - 100m U-16 female: avg=14.2s, good=13.2s, excellent=12.5s
   - Bowling speed U-16 male: avg=90km/h, good=105km/h, excellent=120km/h
3. SAI_TESTS: verify all 8 test names match official SAI documentation:
   30m sprint, 60m sprint, 600m run, standing broad jump, vertical jump,
   4x10m shuttle run, sit & reach flexibility, BMI
4. Add a calculatePercentile(value, metricKey, ageGroup, gender) function:
   - For time-based metrics: LOWER is better (invert the comparison)
   - For distance/count: HIGHER is better
   - Return 0-100 percentile

────────────────────────────────────────────────────────
TASK 2: src/components/assessment/TimerWidget.jsx — STOPWATCH PERFECTION
────────────────────────────────────────────────────────
WHY: This is the HERO component judges interact with. A laggy or ugly
timer destroys the "certified scouting station" claim instantly.

WHAT TO DO:
1. Precision: use performance.now() for timing, NOT Date.now().
   Store startTime on start, calculate elapsed = performance.now() - startTime.
   Display: MM:SS.cc format (centiseconds).
2. Display: use timer-display CSS class (already in design system).
   Font: var(--font-mono), size: clamp(3rem, 10vw, 5rem).
   Color states: timer-ready (white), timer-running (red), timer-stopped (green).
3. Buttons — LARGE (judges will demo on projector):
   START: 80px circle, background var(--accent-success), icon Play.
   STOP: 80px circle, background var(--accent-danger), icon Square.
   RESET: 48px, ghost style. LAP: 48px, secondary style.
   Layout: START/STOP are centered, RESET left, LAP right.
4. Animation: when running, add a subtle glow pulse on the timer number.
   Use animate-glow class or custom: box-shadow oscillating.
5. Vibration: navigator.vibrate?.(100) on START and STOP.
6. Sound: on STOP, play a short "beep" using AudioContext:
   const ctx = new AudioContext(); const osc = ctx.createOscillator();
   osc.frequency.value = 880; osc.connect(ctx.destination);
   osc.start(); setTimeout(() => osc.stop(), 150);
7. Lap functionality: show lap times in a scrollable list below timer.
   Each lap: "Lap 1: 00:12.45" with delta from previous lap.
8. 3-2-1 Countdown: before starting, show "3... 2... 1... GO!" animation.
   Each number: large (5rem), scale-in, hold 800ms, scale-out.
   "GO!": gradient text, hold 500ms, then timer starts.
9. Props: { onStop(timeMs), onLap(lapMs), autoStart, countdownEnabled }

────────────────────────────────────────────────────────
TASK 3: src/components/assessment/SAITestEngine.jsx — GUIDED FLOW
────────────────────────────────────────────────────────
WHY: The SAI 8-test battery is our "standardized" differentiator.
It must feel like a professional testing station, not a form.

WHAT TO DO:
1. Step indicator: horizontal progress bar with 8 dots, each labeled
   with test name abbreviation (30m, 60m, 600m, SBJ, VJ, 4x10, SR, BMI).
   Current dot: accent-primary + glow. Completed: accent-success checkmark.
2. Each test screen:
   a. Test name (large heading-2) + icon/emoji
   b. Instructions card (glass-card): 2-3 bullet points explaining the test.
      Example for 30m Sprint:
      "• Mark a 30-meter distance with clear start and end markers"
      "• Athlete starts from standing position behind the start line"
      "• Timer starts on first movement, stops when chest crosses finish line"
   c. For timer tests: embed TimerWidget with countdown enabled.
   d. For manual tests (broad jump, vertical jump, flexibility):
      Number input with unit label, + / - stepper buttons, large display.
   e. For BMI: two inputs (height cm, weight kg) → auto-calculate and display BMI.
      Show BMI category: Underweight (<18.5), Normal (18.5-24.9), Overweight (>25).
3. After recording each test:
   a. Show the result prominently with percentile badge.
   b. Compare to SAI benchmark: "Above Average" (green), "Average" (yellow), "Below Average" (red).
   c. "Next Test →" button. Allow "Skip" (greyed out, smaller).
4. After all 8 tests:
   a. Summary screen: all 8 results in a table/list.
   b. Overall percentile calculated as average of all test percentiles.
   c. "Proceed to Attestation →" button.
5. Transitions: slide animation between tests (translateX).

────────────────────────────────────────────────────────
TASK 4: src/components/assessment/MetricsRecorder.jsx — DYNAMIC FORMS
────────────────────────────────────────────────────────
WHY: Sport-specific metrics distinguish SENTRAK from a generic fitness app.
Each sport's form must feel custom-built for that sport.

WHAT TO DO:
1. Load metrics from sportMetrics.js based on athlete's selected sport.
2. For each metric, render the correct input based on inputType:
   - "timer" → embed TimerWidget. When stopped, auto-fill value.
   - "manual" → number input with unit label. Large + / - stepper buttons.
     Step size appropriate to unit (0.01 for seconds, 1 for counts, 0.1 for meters).
   - "count" → large counter display with increment (+) and decrement (-) buttons.
     65px circular buttons with the number in the center. Min 0.
   - "rating" → 5 stars or 5 pill buttons labeled 1-5.
     Selected: filled star / accent background.
3. Each completed metric: green checkmark next to the metric name.
4. Progress: "3 of 7 metrics recorded" bar at top.
5. When all metrics recorded: show summary + "Save Assessment" button.
6. Save: createAssessment() for each metric → store in localStorage
   'sentrak_assessments' array. Include athleteId, sport, timestamp.

────────────────────────────────────────────────────────
TASK 5: src/components/assessment/AttestationForm.jsx — TRUST VISUAL
────────────────────────────────────────────────────────
WHY: Community attestation is our KILLER differentiator. "3 witnesses + OTP"
is what makes judges say "this prevents fraud." Must look official.

WHAT TO DO:
1. Header: "Community Attestation" with shield icon + "3 witnesses required"
2. 3 witness slots in a row (or stacked on mobile):
   Each slot is a glass-card with:
   a. Witness icon (numbered: ①②③)
   b. Name input (VoiceInput component if available, else plain text)
   c. Phone input (10-digit, Indian format validation: starts with 6-9)
   d. "Send OTP" button → triggers OTP flow
3. OTP Flow (demo simulation):
   a. Button changes to "OTP Sent ✓" with countdown "Resend in 30s"
   b. Show 6-digit OTP input field (auto-focus, digit-by-digit boxes like banking apps)
   c. For demo: accept ANY 6 digits as valid
   d. On verify: green checkmark animation, witness slot turns green-bordered
4. Progress indicator: large visual "0/3 → 1/3 → 2/3 → 3/3 VERIFIED ✓"
   Use 3 circles connected by lines. Filled circle = verified.
   When all 3 verified: celebration effect — the entire form gets a
   "Community Verified ✓" banner with badge-verified styling.
5. Store attestations with the assessment: createAttestation() for each witness.
6. Hash: after all 3 verified, generate SHA-256 hash using hashVerify.js.
   Show the hash as a short fingerprint: "Integrity: a3f2...9bc1 ✓"

────────────────────────────────────────────────────────
TASK 6: src/utils/hashVerify.js — ROBUSTNESS
────────────────────────────────────────────────────────
WHY: Hash verification is our "tamper-proof" claim. Must actually work.

WHAT TO DO:
1. generateHash(assessment): concatenate athleteId + testType + value +
   timestamp + all witness phones (sorted alphabetically for determinism).
   Use crypto.subtle.digest('SHA-256', ...). Return hex string.
2. verifyHash(assessment, expectedHash): regenerate → compare.
   Return { valid: boolean, computedHash: string }.
3. If crypto.subtle is not available (HTTP, not HTTPS):
   Fallback to a simple hash function (djb2 or similar). Log warning.
4. Add JSDoc comments explaining the hashing approach.

────────────────────────────────────────────────────────
TASK 7: src/utils/offlineDB.js — INDEX DB RELIABILITY
────────────────────────────────────────────────────────
WHY: If IndexedDB fails (incognito mode, Safari quirks, storage full),
the app must fallback to localStorage silently.

WHAT TO DO:
1. Wrap ALL idb operations in try/catch.
2. If IndexedDB open fails: set a flag `useLocalStorageFallback = true`.
3. When fallback=true, all functions use localStorage instead:
   saveAthlete → JSON.stringify to localStorage
   getAthlete → JSON.parse from localStorage
4. On app start: try to initDB(). If fails, log warning, use fallback.
5. getSyncQueue() and addToSyncQueue(): these power the offline→online sync.
   Each queue item: { id, type: 'athlete'|'assessment', data, timestamp }.
6. Ensure all functions are async and return consistent shapes.

────────────────────────────────────────────────────────
TASK 8: src/hooks/useOfflineSync.js — VISUAL FEEDBACK
────────────────────────────────────────────────────────
WHY: When syncing resumes after offline period, user must KNOW
their data is being saved to the cloud. Silent sync = anxiety.

WHAT TO DO:
1. Return: { isOnline, isSyncing, pendingCount, lastSyncTime, syncNow }
2. On mount: add online/offline event listeners.
3. When coming online with pendingCount > 0:
   - Set isSyncing = true
   - Process queue items one by one (for demo: just mark as synced)
   - Decrement pendingCount visually
   - Set isSyncing = false when done
4. lastSyncTime: store in localStorage, display as relative ("2 min ago").
5. For hackathon: actual Firestore sync is OPTIONAL.
   The architecture must exist: if Firebase is configured, sync for real.
   If demo mode (no real Firebase): just clear the queue and pretend.

────────────────────────────────────────────────────────
TASK 9: src/utils/fraudDetection.js — SMART FLAGGING
────────────────────────────────────────────────────────
WHY: "Anomaly detection" is a judge buzzword. Must be specific and smart.

WHAT TO DO:
1. checkAnomalies(assessment, sport): checks for physically impossible values.
   Per sport examples:
   - 100m sprint: < 9.58s (world record) → flag "Exceeds world record"
   - 100m sprint for U-12: < 11.0s → flag "Exceptional for age group"
   - Long jump: > 8.95m → flag "Exceeds world record"
   - Bowling speed: > 160 km/h → flag "Exceeds known maximum"
   - BMI: < 12 or > 40 → flag "Unusual BMI value"
2. Return: { isAnomaly: boolean, flags: string[], severity: 'low'|'medium'|'high' }
   low = unusual but possible, medium = very unlikely, high = physically impossible
3. checkAttestorReputation(phone, allAttestations):
   - Count how many times this phone appears as witness in last 24h
   - > 10 in 24h → "High volume attestor" (medium)
   - > 20 → "Suspicious attestation pattern" (high)
   - Return: { trustScore: 0-100, flags: string[] }
4. Add JSDoc comments explaining each threshold and why.

────────────────────────────────────────────────────────
TASK 10: src/components/assessment/VideoClipCapture.jsx — OPTIONAL BUT WOW
────────────────────────────────────────────────────────
WHY: Video evidence of an assessment makes the "tamper proof" claim
tangible. Even a 10-second clip is powerful.

WHAT TO DO:
1. Camera preview: 16:9 aspect ratio, border-radius: var(--radius-lg).
   Mirror the preview (transform: scaleX(-1)) for selfie feel.
2. Record button: large red circle (70px), with inner white circle.
   When recording: red dot pulses, timer counts up to 15s, auto-stops.
3. After recording: show playback with controls.
   "Use This" and "Retake" buttons.
4. Storage: convert to blob → base64 string → store with assessment.
   Compress: use low resolution { video: { width: 480, height: 360 } }.
5. If camera permission denied: show friendly message, not error.
   "Video is optional. Skip to continue."
6. Skip button always visible.

────────────────────────────────────────────────────────
TASK 11: src/pages/RecordAssessment.jsx — FULL PAGE FLOW
────────────────────────────────────────────────────────
WHY: This page orchestrates everything. Broken orchestration = broken demo.

WHAT TO DO:
1. Multi-step flow:
   Step 1: Select athlete (dropdown of localStorage athletes + DEMO_ATHLETES)
   Step 2: SportSelector → pick sport
   Step 3: Choose "SAI Battery" or "Sport-Specific" (two large cards)
   Step 4: SAITestEngine or MetricsRecorder (based on choice)
   Step 5: AttestationForm (3 witnesses verify)
   Step 6: Results summary with hash displayed
   Step 7: Optional VideoClipCapture
   Step 8: Success! → link to athlete's profile
2. Step navigation: numbered progress bar at top.
   Back button on each step. Can't skip forward past current.
3. Save from Step 6: write all assessments to localStorage.
   Update the athlete's assessment count in their stored record.
4. Handle URL param :athleteId — pre-select that athlete in Step 1.
5. Responsive: works on mobile. Steps stack vertically.

────────────────────────────────────────────────────────
TASK 12: src/components/assessment/ChallengeCard.jsx + src/pages/Challenges.jsx — ENGAGEMENT
────────────────────────────────────────────────────────
WHY: Challenges drive organic data collection. "Fastest U-16 in your district"
makes athletes WANT to register and be assessed.

ChallengeCard:
1. Glass card with sport emoji, title, description.
2. Stats row: entries count, time remaining, top scorer.
3. "Enter Challenge" button → navigate to /assess with sport pre-selected.
4. Countdown timer badge: "X days remaining" or "Ends Today!" (red).
5. Leaderboard preview: top 3 names + scores (from DEMO data).

Challenges page:
1. Header: "District Challenges" with trophy icon.
2. Filter bar: Sport, Age Group, District dropdowns.
3. Grid of ChallengeCards (at least 5 seeded challenges):
   - Fastest U-16 60m Sprint — Dharmapuri
   - Longest U-14 Broad Jump — Salem
   - Best U-18 Bowling Speed — Madurai
   - Most Push-ups U-16 60s — Coimbatore
   - Fastest U-14 Shuttle Run — Thanjavur
4. Create challenges using createChallenge() from dataShapes.js.
5. "Create Challenge" button (for coaches/admins in future).

═══════════════════════════════════════════════════════════════
                    EXECUTION ORDER
═══════════════════════════════════════════════════════════════

NOW: Clone → install → branch feat/assessment-v2 → npm run dev
THEN: Tasks 1-12 in order. Commit + push + CHANGELOG after each.
Tags after tasks 4, 8, 12.

DO NOT STOP. DO NOT ASK. Build, test, push, continue.
```
