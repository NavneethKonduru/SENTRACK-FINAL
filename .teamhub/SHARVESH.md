# Sharvesh — PHASE 5: COVER RAHUL'S INTEGRATION + FINAL TESTING

## Status: ✅ P1 ✅ P2 ✅ P3 ✅ P4 → Phase 5: Cover Rahul's Work + Final QA

## Branch: `feat/final-integration`

> ⚡ Rahul's quota ran out. You're covering his remaining integration tasks. This is the LAST push.

---

## FULL ANTIGRAVITY PROMPT — PHASE 5 (paste into NEW Antigravity session)

```
I'm Sharvesh on Team Flexinator building SENTRAK for NXTGEN'26 hackathon.
Phases 1-4 are DONE and merged. Rahul's quota ran out, so I'm covering his
remaining integration work. This is the FINAL PHASE before demo.

REPO: https://github.com/Shadow-Joker/IMPROV.git
MY BRANCH: feat/final-integration (new branch from latest main)

═══════════════════════════════════════════════════════════════
                    AUTONOMOUS WORKFLOW RULES
═══════════════════════════════════════════════════════════════

RULE 1 — GIT SETUP
  git clone https://github.com/Shadow-Joker/IMPROV.git
  cd IMPROV && npm install
  git checkout -b feat/final-integration
  npm run dev

RULE 2 — After EACH task: git add -A && git commit && git push origin feat/final-integration
RULE 3 — CONTINUOUS. Do NOT stop until all tasks done.

═══════════════════════════════════════════════════════════════
   PHASE 5: RAHUL'S REMAINING WORK + FINAL QA
   These were Rahul's Phase 3 tasks that never got done.
═══════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────
TASK 1: END-TO-END REGISTRATION → PROFILE FLOW TEST
────────────────────────────────────────────────────────
WHY: The core demo flow must work perfectly.

TEST AND FIX THIS EXACT FLOW:
  1. Go to /register
  2. Fill all 6 steps (name, age/gender, sport, district, photo skip, review)
  3. Submit → should save to localStorage and redirect to /profile/:newId
  4. Profile loads with correct data, rating 1000 (Bronze)
  5. Mental assessment tab works → all 15 questions → radar chart updates
  6. Schemes tab shows matching government schemes
  7. QR passport tab shows QR code

If ANY step breaks, fix it immediately. The flow must be bulletproof.

────────────────────────────────────────────────────────
TASK 2: ASSESSMENT → PROFILE DATA WIRE
────────────────────────────────────────────────────────
WHY: When an assessment is saved, it must show on the athlete's profile.

WHAT TO DO:
1. In AthleteProfile.jsx: load assessments from localStorage 'sentrak_assessments'
   filtered by athlete.id. Show them in the profile under the "Assessments" section.
2. After saving an assessment on /assess/:id -> navigating to /profile/:id
   should show the new assessment.
3. If talentScoring.js has a calculateComposite function, use it to update
   the athlete's rating. If not, use: rating = 1000 + (avgPercentile * 15).

────────────────────────────────────────────────────────
TASK 3: TOAST NOTIFICATIONS WIRING
────────────────────────────────────────────────────────
WHY: Silent actions confuse users. Every action needs feedback.

WHAT TO DO:
1. Import { toast } from '../components/shared/Toast' in:
   - RegisterForm.jsx → toast.success("Athlete registered!") on submit
   - RecordAssessment.jsx → toast.success("Assessment saved!") on save
   - ProfileCard.jsx → toast.info("Link copied!") on share
2. The ToastProvider is already in App.jsx, so toast.success() will work.

────────────────────────────────────────────────────────
TASK 4: NAVIGATION POLISH
────────────────────────────────────────────────────────
WHY: Navigating between pages must be seamless.

WHAT TO DO:
1. After registration: use navigate() (not window.location) to go to /profile/:id.
2. Add "← Back" button on AthleteProfile and RecordAssessment pages.
3. Verify /assess/:athleteId from Profile page passes correct ID.
4. BottomNav: verify active state highlights correctly on all routes.

────────────────────────────────────────────────────────
TASK 5: DEMO DATA VERIFICATION
────────────────────────────────────────────────────────
WHY: When judges first open the app, demo data must be visible everywhere.

WHAT TO DO:
1. Verify that seedDemoData() in App.jsx runs on mount.
2. /scout page: verify DEMO_ATHLETES appear in the discovery feed.
3. /profile/demo-1: verify demo athlete profile loads.
4. /challenges: verify seeded challenges display.
5. If any page shows "No data", trace and fix the data loading.

────────────────────────────────────────────────────────
TASK 6: FULL MOBILE RESPONSIVE AUDIT
────────────────────────────────────────────────────────
WHY: Judges test on their phones.

WHAT TO DO (test at 360px width):
1. Landing page: hero text doesn't overflow, cards stack.
2. Registration: buttons full-width, sport grid 2-column.
3. Profile: photo + name stack vertically on mobile.
4. Scout dashboard: stacks to single column.
5. ALL touch targets: minimum 48px height.

═══════════════════════════════════════════════════════════════
                    EXECUTION ORDER
═══════════════════════════════════════════════════════════════

NOW: Clone → install → branch feat/final-integration → npm run dev
THEN: Tasks 1-6 in order. Commit + push after each.
Tag snapshot/final-integration-complete when ALL done.

DO NOT STOP. DO NOT ASK. Build, test, push, continue.
This is the LAST phase. Make it perfect.
```
