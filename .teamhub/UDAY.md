# Uday — PHASE 2: POLISH & PRECISION

## Status: ✅ Phase 1 DONE → Phase 2: Full Polish + WOW Factor

## Branch: `feat/scout-v2`

---

## FULL ANTIGRAVITY PROMPT — PHASE 2 (paste into NEW Antigravity session)

```
I'm Uday on Team Flexinator building SENTRAK for NXTGEN'26 hackathon.
MY PHASE 1 IS DONE — all 14 scout files are built and merged to main.
Now PHASE 2: precision polish, bug fixing, and making the Scout Dashboard look like a million bucks.

REPO: https://github.com/Shadow-Joker/IMPROV.git
MY BRANCH: feat/scout-v2 (new branch from latest main)
I MUST NOT touch files outside my ownership list.

═══════════════════════════════════════════════════════════════
                    AUTONOMOUS WORKFLOW RULES
═══════════════════════════════════════════════════════════════

RULE 1 — GIT SETUP
  git clone https://github.com/Shadow-Joker/IMPROV.git
  cd IMPROV && npm install
  git checkout -b feat/scout-v2
  npm run dev

RULE 2 — GIT DISCIPLINE
  After EACH file improved: git add -A && git commit -m "polish(scout): <what>" && git push origin feat/scout-v2
  After every 3rd commit: git tag snapshot/scout-v2-p<N> && git push origin --tags
  Every 2 hours: git pull origin main && merge

RULE 3 — CHANGELOG: append after every push.
RULE 4 — CONTINUOUS. Do NOT stop until all tasks done.

═══════════════════════════════════════════════════════════════
   PHASE 2: DETAILED LINE-BY-LINE IMPROVEMENTS
   REASON for every change is explained.
═══════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────
TASK 1: src/components/scout/TalentHeatMap.jsx — VISUAL IMPACT
────────────────────────────────────────────────────────
WHY: Data visualizations are candy for judges. The heat map must look
dynamic and interactive, not just like a static image.

WHAT TO DO:
1. Make the SVG map of Tamil Nadu interactive. Each district should be a
   separate path element (use public/data/tn-districts.json coordinates or placeholder SVG circles).
2. Intensity styling: fill color should range from soft blue (low talent)
   to deep primary accent (high talent concentration).
3. Hover effects: when hovering over a district, scale it up slightly (1.05)
   and show a glassmorphic tooltip with:
   - District Name
   - Total Athletes Registered
   - Top Sport in District
4. Animation: stagger the fade-in of districts based on talent density.

────────────────────────────────────────────────────────
TASK 2: src/components/scout/ScoutDashboard.jsx — PREMIUM LAUNCHPAD
────────────────────────────────────────────────────────
WHY: The dashboard is the first thing a recruiter sees. It must scream
"enterprise-grade analytics".

WHAT TO DO:
1. Top KPI Cards: 3 large metrics cards (Total Athletes, Assessments This Week,
   New Verified Talent). Use animated stroke charts in the background of each card.
2. Layout: CSS Grid. Heat map takes up 60% of width on desktop, Discovery Feed 40%.
3. Add a "Live Activity" ticker string at the bottom displaying recent attestations.
4. Add a quick "Generate Talent Report" button that simulates downloading a PDF.

────────────────────────────────────────────────────────
TASK 3: src/components/scout/DiscoveryFeed.jsx — ADDICTIVE UX
────────────────────────────────────────────────────────
WHY: Filtering through talent should feel like a modern social feed,
but for elite recruitment.

WHAT TO DO:
1. Card styling: each athlete card needs their circular avatar, sport badge,
   and their primary composite score (e.g., 92 - Elite).
2. "New Assessment" highlights: if an athlete had a recent assessment,
   add a pulsing green dot and "New Data" badge.
3. Infinite scroll simulation: only render 5 at a time, add a "Load More"
   button that fetches 5 more from demo data.
4. Quick actions on hover: "View Passport", "Shortlist", "Send Offer".

────────────────────────────────────────────────────────
TASK 4: src/components/scout/SearchFilters.jsx — POWER USER TOOLS
────────────────────────────────────────────────────────
WHY: A scout needs complex querying. The UI must support this smoothly.

WHAT TO DO:
1. Multi-select pills for Sports (e.g., [Kabaddi] [Athletics] [+]).
2. Age range double-slider (e.g., 12 to 18 years).
3. "Verified Only" toggle switch (stylish iOS-like switch, green accent).
4. Minimum Rating threshold slider (Bronze to Prodigy).
5. Ensure applying filters updates the DiscoveryFeed immediately
   (use local state filtering on the DEMO_ATHLETES dataset).

────────────────────────────────────────────────────────
TASK 5: src/components/scout/AthleteRanking.jsx — GAMIFICATION
────────────────────────────────────────────────────────
WHY: Leaderboards create competition and context.

WHAT TO DO:
1. Table format with sticky header. Column: Rank, Athlete, District, Score, Trend.
2. Trend column: green up arrow (e.g., +12 pts) or red down arrow.
3. Top 3 rows: style specially. Gold, Silver, Bronze background tints
   for ranks 1, 2, and 3.
4. "District Scope" toggle: allow switching between "Statewide" and
   "Your District" leaderboards.

────────────────────────────────────────────────────────
TASK 6: src/components/scout/RecruitmentPortal.jsx & OfferCard.jsx — CLOSING THE LOOP
────────────────────────────────────────────────────────
WHY: The final step of the platform is actually placing the athlete.

WHAT TO DO:
1. Recruitment portal lists "Saved Athletes".
2. Clicking "Make Offer" opens an OfferCard modal.
3. OfferCard fields:
   - Offer Type (Scholarship, Academy Admission, Sponsorship)
   - Value/Grant Amount
   - Message to Athlete/Coach
4. "Send Offer" button with simulated success state: confetti,
   toast notification, and status changed to "Offer Pending".
5. Track mock offers in localStorage ('sentrak_mock_offers').

────────────────────────────────────────────────────────
TASK 7: src/components/demo/RevenueCalculator.jsx & ScaleMetrics.jsx — BUSINESS PITCH
────────────────────────────────────────────────────────
WHY: Hackathons require a business model. These components prove viability.

WHAT TO DO:
1. RevenueCalculator: interactive sliders for
   - "Districts Onboarded"
   - "Assessments per Month"
   - "Premium Scout Subscriptions"
   Auto-calculate projected annual recurring revenue (ARR) with large numbers.
2. ScaleMetrics: visual funnel showing "Villages → Schools → Athletes → Prodigies Discovered".
   Use animated liquid fill or funnel SVG.

────────────────────────────────────────────────────────
TASK 8: RESPONSIVE & MOBILE
────────────────────────────────────────────────────────
WHY: Recruiters use tablets on the field.

WHAT TO DO:
1. Ensure the layout gracefully stacks on screens < 768px.
2. Hide complex data tables on mobile, show card-based lists instead.
3. Make sure Touch Targets on filters and buttons are at least 44x44px.

═══════════════════════════════════════════════════════════════
                    EXECUTION ORDER
═══════════════════════════════════════════════════════════════

NOW: Clone → install → branch feat/scout-v2 → npm run dev
THEN: Tasks 1-8 in order. Commit + push + CHANGELOG after each.
Tags after tasks 3, 6, 8.

DO NOT STOP. DO NOT ASK. Build, test, push, continue.
```
