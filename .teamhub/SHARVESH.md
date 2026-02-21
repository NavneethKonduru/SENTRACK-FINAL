# Sharvesh — PHASE 3: INTEGRATION + DEMO READINESS

## Status: ✅ Phase 1 DONE ✅ Phase 2 DONE → Phase 3: Integration & Demo

## Branch: `feat/assessment-v3`

---

## FULL ANTIGRAVITY PROMPT — PHASE 3 (paste into NEW Antigravity session)

```
I'm Sharvesh on Team Flexinator building SENTRAK for NXTGEN'26 hackathon.
PHASE 1 (build) and PHASE 2 (polish) are DONE and merged to main.
Now PHASE 3: Wire everything together, fix integration bugs, demo-proof the entire assessment flow.

REPO: https://github.com/Shadow-Joker/IMPROV.git
MY BRANCH: feat/assessment-v3 (new branch from latest main)
I MUST NOT touch files outside my ownership list.

═══════════════════════════════════════════════════════════════
                    AUTONOMOUS WORKFLOW RULES
═══════════════════════════════════════════════════════════════

RULE 1 — GIT SETUP
  git clone https://github.com/Shadow-Joker/IMPROV.git
  cd IMPROV && npm install
  git checkout -b feat/assessment-v3
  npm run dev

RULE 2 — GIT DISCIPLINE
  After EACH task completed: git add -A && git commit -m "integration(assessment): <what>" && git push origin feat/assessment-v3
  After every 3rd commit: git tag snapshot/assessment-v3-int-<N> && git push origin --tags
  Every 2 hours: git pull origin main && merge

RULE 3 — CHANGELOG: append after every push.
RULE 4 — CONTINUOUS. Do NOT stop until all tasks done.

═══════════════════════════════════════════════════════════════
   PHASE 3: INTEGRATION TASKS
   Focus: cross-component wiring, data flow, demo-proofing
═══════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────
TASK 1: END-TO-END ASSESS → PROFILE FLOW
────────────────────────────────────────────────────────
WHY: The judge needs to see an assessment be completely fulfilled,
saved, hashed, and immediately visible on the athlete's passport.

TEST THIS EXACT FLOW (fix anything broken):
  1. Go to /assess/:demo-1 (pick Demo Athlete 1)
  2. Step 1: select Athletics constraint.
  3. Step 2: Use SAI Battery.
  4. Step 3: Run the timer / enter data for all 8 SAI tests.
  5. Step 4: Attestation form - fill 3 fake names & phones, click verify OTP.
  6. Step 5: Save Assessment.
  7. VERIFY: The data is appended to localStorage 'sentrak_assessments'.
  8. VERIFY: The app automatically redirects to /profile/demo-1.
  9. VERIFY: On the profile page, under "Recent Assessments", the newly inserted record IS VISIBLE, complete with the green verified hash badge.

FIX ANY BREAKAGE in this flow immediately.

────────────────────────────────────────────────────────
TASK 2: PERSISTENCE & OFFLINE QUEUE
────────────────────────────────────────────────────────
WHY: If the internet drops during the assessment, we cannot lose data.

WHAT TO DO:
1. Ensure saveAssessment() uses offlineDB correctly, wrapping it in try/catch.
2. If `navigator.onLine` is false, add a visual indicator to RecordAssessment page: "Saving to Offline Queue".
3. When returning to /profile/:id, ensure we load assessments from both actual local storage AND the pending offline queue so the user sees their work instantly.

────────────────────────────────────────────────────────
TASK 3: FRAUD DETECTION FEEDBACK
────────────────────────────────────────────────────────
WHY: The anomaly flagging works in code but needs to be visible in UI.

WHAT TO DO:
1. In the Summary Step (Step 6), run the checkAnomalies() function from fraudDetection.js on the compiled data.
2. If anomaly detected: highlight the suspicious value in YELLOW or RED on the summary screen, with a warning icon.
3. Require the Coach to click a checkbox: "I verify this unusual reading is accurate" before allowing them to save. This is a massive trust signal for the judges.

────────────────────────────────────────────────────────
TASK 4: LOCALSTORAGE EDGE CASES & ERROR BOUNDARIES
────────────────────────────────────────────────────────
WHY: Corrupt data shouldn't crash the app during demo.

WHAT TO DO:
1. Add an ErrorBoundary wrapper specifically around SAITestEngine and MetricsRecorder. If they throw, show a gentle "Could not load test format. Resetting." and clear state.
2. In your loading logic for `DEMO_ATHLETES`, handle the case where standard athletes don't have the sport chosen. Guard all loops and map functions with `if (!array) return null`.

────────────────────────────────────────────────────────
TASK 5: RESPONSIVE MOBILE POLISH
────────────────────────────────────────────────────────
WHY: RecordAssessment is used by coaches on the field on mobile phones.

WHAT TO DO:
1. TimerWidget MUST NOT overflow horizontally on an iPhone SE (320px). Resize buttons if necessary.
2. Attestation input boxes need to use input type="tel" to trigger the number pad on mobile.
3. Make sure step navigation buttons ("Next", "Back") are pinned to the bottom of the screen on mobile, easy to hit with thumbs.

═══════════════════════════════════════════════════════════════
                    EXECUTION ORDER
═══════════════════════════════════════════════════════════════

NOW: Clone → install → branch feat/assessment-v3 → npm run dev
THEN: Tasks 1-5 in order. Commit + push + CHANGELOG after each.
Create a final tag snapshot/assessment-v3-final when done.

DO NOT STOP. DO NOT ASK. Build, test, push, continue.
```
