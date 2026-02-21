# Rahul — PHASE 3: INTEGRATION + DEMO READINESS

## Status: ✅ Phase 1 DONE ✅ Phase 2 DONE → Phase 3: Integration & Demo

## Branch: `feat/athlete-v3`

---

## FULL ANTIGRAVITY PROMPT — PHASE 3 (paste into NEW Antigravity session)

```
I'm Rahul on Team Flexinator building SENTRAK for NXTGEN'26 hackathon.
PHASE 1 (build) and PHASE 2 (polish) are DONE and merged to main.
Now PHASE 3: Wire everything together, fix integration bugs, demo-proof the entire athlete flow.

REPO: https://github.com/Shadow-Joker/IMPROV.git
MY BRANCH: feat/athlete-v3 (new branch from latest main)
I own files in src/components/athlete/*, src/components/shared/*, src/hooks/*, src/pages/Register.jsx, src/pages/AthleteProfile.jsx, and the utils: translations.js, schemes.js, mentalScoring.js.

═══════════════════════════════════════════════════════════════
                    AUTONOMOUS WORKFLOW RULES
═══════════════════════════════════════════════════════════════

RULE 1 — GIT SETUP
  git clone https://github.com/Shadow-Joker/IMPROV.git
  cd IMPROV && npm install
  git checkout -b feat/athlete-v3
  npm run dev

RULE 2 — GIT DISCIPLINE
  After EACH task completed: git add -A && git commit -m "integration(athlete): <what>" && git push origin feat/athlete-v3
  After every 3rd commit: git tag snapshot/athlete-v3-int-<N> && git push origin --tags
  Every 2 hours: git pull origin main && merge

RULE 3 — CHANGELOG: append after every push.
RULE 4 — CONTINUOUS. Do NOT stop until all tasks done.

═══════════════════════════════════════════════════════════════
   PHASE 3: INTEGRATION TASKS
   Focus: cross-component wiring, data flow, demo-proofing
═══════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────
TASK 1: END-TO-END REGISTRATION → PROFILE FLOW
────────────────────────────────────────────────────────
WHY: In demo, the judge sees register → profile in 20 seconds. If any
step breaks the chain, the demo fails completely.

TEST THIS EXACT FLOW (fix anything broken):
  1. Go to /register
  2. Fill Step 1: name = "Devi Ramasamy", Tamil = "தேவி ராமசாமி"
  3. Step 2: age = 15, gender = female
  4. Step 3: sport = Kabaddi
  5. Step 4: district = Madurai, village = Thirumangalam
  6. Step 5: skip photo (use fallback avatar)
  7. Step 6: review → submit
  8. VERIFY: redirects to /profile/:newId
  9. VERIFY: profile loads with correct data, rating shows 1000 (Bronze)
  10. VERIFY: mental assessment tab works, all 15 questions flow
  11. VERIFY: after mental assessment, radar chart updates, score appears
  12. VERIFY: schemes tab shows matching schemes for 15yo female Kabaddi player
  13. VERIFY: QR passport tab renders QR code, download works

FIX any broken step. The flow must work PERFECTLY end-to-end.

────────────────────────────────────────────────────────
TASK 2: DEMO DATA PRELOAD
────────────────────────────────────────────────────────
WHY: When the judge opens the app, there must already be athletes
to browse. Empty app = dead demo.

WHAT TO DO:
1. In src/pages/Landing.jsx (or a new src/utils/demoLoader.js):
   Create a function seedDemoData() that:
   a. Checks localStorage for 'sentrak_demo_seeded' flag
   b. If not seeded: write DEMO_ATHLETES (from dataShapes.js) to localStorage 'sentrak_athletes'
   c. Also write DEMO_ASSESSMENTS to localStorage 'sentrak_assessments'
   d. Set 'sentrak_demo_seeded' = 'true'
2. Call seedDemoData() in App.jsx useEffect on mount.
3. Now /profile/demo-1 through /profile/demo-10 all load real profiles.
4. The scout dashboard (when Uday integrates) will find athletes in localStorage.

────────────────────────────────────────────────────────
TASK 3: ASSESSMENT INTEGRATION WITH PROFILE
────────────────────────────────────────────────────────
WHY: Sharvesh built the assessment engine. When an assessment is saved,
it should update the athlete's profile card automatically.

WHAT TO DO:
1. In AthleteProfile.jsx: load assessments from localStorage 'sentrak_assessments'
   filtered by athleteId. Display them in the ProfileCard assessments section.
2. After an assessment is saved (from /assess/:id), when user navigates
   back to /profile/:id, the new assessment should appear immediately.
3. Recalculate talentRating based on latest assessments:
   - Import calculateComposite and compositeToRating from talentScoring.js
   (Uday may not have built this yet — if so, create a MINIMAL version:
    talentRating = 1000 + (avgPercentile * 15), clamped to 1000-2500)
4. Update the stored athlete's talentRating in localStorage after recalculation.

────────────────────────────────────────────────────────
TASK 4: NAVIGATION FLOW POLISH
────────────────────────────────────────────────────────
WHY: Navigating between pages should feel seamless, not janky.

WHAT TO DO:
1. After registration: ensure navigate() works (not window.location).
2. Back buttons: all pages should have a "← Back" button in the header
   area using navigate(-1). Style: btn-ghost with ArrowLeft icon.
3. Breadcrumbs on profile page: "Home > Athletes > Murugan K."
   Use Link components, text-muted color for inactive crumbs.
4. BottomNav: highlight active route correctly. The /profile/:id page
   should NOT highlight any nav item (it's a detail page).
5. /assess/:athleteId link from profile: verify it passes the correct ID.

────────────────────────────────────────────────────────
TASK 5: TOAST NOTIFICATION SYSTEM
────────────────────────────────────────────────────────
WHY: User actions need feedback. "Did it save?" anxiety ruins UX.

WHAT TO DO:
1. Create src/components/shared/Toast.jsx:
   - Positioned fixed, bottom: 80px, centered
   - Glass card with icon + message
   - Types: success (green), error (red), info (blue)
   - Auto-dismiss after 3 seconds, slide-up animation in, fade out
   - Export a useToast() hook or a toast() function
2. Use context or a simple event emitter:
   - toast.success("Athlete registered!") / toast.error("Save failed")
3. Wire into RegisterForm (on submit), MentalProfileForm (on complete),
   ProfileCard (on share), QRPassport (on download).
4. Tamil support: all toast messages should use t() for translation.

────────────────────────────────────────────────────────
TASK 6: RESPONSIVE AUDIT — MOBILE CRITICAL
────────────────────────────────────────────────────────
WHY: Judges may test on their phones. If it breaks on mobile, we lose points.

WHAT TO DO (test at 360px width in dev tools):
1. RegisterForm: each step must fit on screen without horizontal scroll.
   Sport grid: 2 columns on mobile (not 3). Buttons: full-width.
2. ProfileCard: photo + name stack vertically on mobile.
   Rating number: don't overflow. Schemes cards: single column.
3. MentalRadarChart: SVG should scale down to 250px width minimum.
   Labels should not overlap or get clipped.
4. QRPassport: single column layout on mobile. QR code centered.
5. Bottom nav: verify 5 icons all fit without wrapping on 320px screens.
6. All touch targets: minimum 48px height (check buttons, links, tabs).
7. Font sizes: nothing below 14px on mobile. Labels at 12px are unreadable.

────────────────────────────────────────────────────────
TASK 7: ERROR BOUNDARY + OFFLINE RESILIENCE
────────────────────────────────────────────────────────
WHY: If any component crashes, the entire app goes white screen.
Rural areas have spotty connectivity — app must never show a blank page.

WHAT TO DO:
1. Create src/components/shared/ErrorBoundary.jsx:
   Class component with componentDidCatch.
   Fallback UI: "Something went wrong. Tap to retry."
   Retry button calls this.setState({ hasError: false }).
2. Wrap each page in ErrorBoundary in App.jsx.
3. All localStorage reads: wrap in try/catch. If JSON parse fails,
   clear the corrupted key and return empty default.
4. All fetch calls (if any): wrap in try/catch with offline fallback.
5. Test: manually corrupt localStorage data → app should recover, not crash.

────────────────────────────────────────────────────────
TASK 8: ACCESSIBILITY BASICS
────────────────────────────────────────────────────────
WHY: Hackathon judges increasingly check accessibility. Basic a11y
takes 10 minutes and impresses judges disproportionately.

WHAT TO DO:
1. All images: add alt text. Profile photo: alt="{name}'s photo".
2. All buttons: add aria-label if icon-only (mic button, close button).
3. All form inputs: associate with <label> using htmlFor.
4. Tab order: verify you can tab through registration form with keyboard.
5. Color contrast: verify text is readable against dark background
   (text-primary #f1f5f9 on bg-primary #0a0e27 = WCAG AAA ✓).
6. Focus styles: add :focus-visible outlines on interactive elements.
   Style: outline: 2px solid var(--accent-primary); outline-offset: 2px;

═══════════════════════════════════════════════════════════════
                    EXECUTION ORDER
═══════════════════════════════════════════════════════════════

NOW: Clone → install → branch feat/athlete-v3 → npm run dev
THEN: Tasks 1-8 in order. After each: commit + push + CHANGELOG.
After tasks 3, 6, 8: create snapshot tag.

DO NOT STOP. DO NOT ASK PERMISSION. Build, test, push, continue.
```
