# Uday — SCOUT

## Role

Scout dashboard, talent heat map, search/filter, rankings, recruitment portal, revenue calculator, discovery feed.

## Branch: `feat/scout`

## Setup

```bash
git clone https://github.com/Shadow-Joker/IMPROV.git
cd IMPROV && npm install
git checkout -b feat/scout
npm run dev
```

## My Files (ONLY touch these)

```
src/components/scout/ScoutDashboard.jsx
src/components/scout/TalentHeatMap.jsx
src/components/scout/AthleteRanking.jsx
src/components/scout/SearchFilters.jsx
src/components/scout/DiscoveryFeed.jsx
src/components/scout/RecruitmentPortal.jsx
src/components/scout/OfferCard.jsx
src/components/demo/RevenueCalculator.jsx
src/components/demo/ScaleMetrics.jsx
src/utils/talentScoring.js
src/utils/districts.js
src/pages/ScoutView.jsx
public/data/tn-districts.json
public/data/sai-benchmarks.json
```

## Page Exports

```javascript
// src/pages/ScoutView.jsx
export default function ScoutView() { ... }
```

## Task Checklist

- [ ] Clone + setup
- [ ] tn-districts.json (38 TN districts)
- [ ] sai-benchmarks.json (age-group benchmarks)
- [ ] districts.js (data utilities)
- [ ] talentScoring.js (composite scoring)
- [ ] SearchFilters (multi-criteria)
- [ ] ScoutDashboard (layout + tabs)
- [ ] AthleteRanking (sorted table)
- [ ] TalentHeatMap (TN SVG map)
- [ ] DiscoveryFeed (live stream)
- [ ] RecruitmentPortal + OfferCard
- [ ] RevenueCalculator
- [ ] ScaleMetrics
- [ ] ScoutView page
- [ ] Polish + responsive

## Sync Commands (every 2 hours)

```bash
git add . && git commit -m "progress: <what>" && git push origin feat/scout
git pull origin main
```

---

## FULL ANTIGRAVITY PROMPT (paste this into your Antigravity session)

```
I'm Uday on Team Flexinator building SENTRAK for NXTGEN'26 hackathon.
We're solving PS2: Grassroots Rural Athlete Talent Discovery Platform.

REPO: https://github.com/Shadow-Joker/IMPROV.git (already scaffolded on main)
MY BRANCH: feat/scout

FIRST: Clone the repo, npm install, checkout feat/scout, run dev server.

I own the SCOUT + DISCOVERY flow. These are MY files (do NOT touch others):

src/components/scout/ScoutDashboard.jsx     — Main scout command center
src/components/scout/TalentHeatMap.jsx      — Interactive TN district SVG map
src/components/scout/AthleteRanking.jsx     — Leaderboard table sorted by rating
src/components/scout/SearchFilters.jsx      — Multi-criteria filter panel
src/components/scout/DiscoveryFeed.jsx      — Live recent assessment stream
src/components/scout/RecruitmentPortal.jsx  — Academy sends offers to athletes
src/components/scout/OfferCard.jsx          — How offers display on athlete side
src/components/demo/RevenueCalculator.jsx   — Interactive TAM calculator with sliders
src/components/demo/ScaleMetrics.jsx        — Animated platform stats counters
src/utils/talentScoring.js                  — Composite talent scoring engine
src/utils/districts.js                      — District data loader + search utils
src/pages/ScoutView.jsx                     — Full scout dashboard page
public/data/tn-districts.json              — All 38 TN districts data
public/data/sai-benchmarks.json            — Age-group performance benchmarks

DESIGN RULES:
1. CSS from src/index.css ONLY — no inline styles or new CSS files
2. Import data shapes from src/utils/dataShapes.js
3. Dark premium theme with glassmorphism
4. DESKTOP-FIRST for scout dashboard (responsive down to tablet)
5. export default function ComponentName() for every page
6. React Router useParams, useNavigate

DATA SHAPES (from dataShapes.js):
// Use ATHLETE and ASSESSMENT shapes as defined there

const OFFER = {
  id: string,
  scoutId: string,
  scoutName: string,
  academyName: string,
  athleteId: string,
  type: "scholarship"|"training"|"trial"|"sponsorship",
  value: string,         // "₹5,00,000/year" or "Full scholarship"
  duration: string,      // "2 years", "6 months"
  location: string,      // "Chennai Sports Academy"
  message: string,       // Personal message to athlete
  status: "pending"|"accepted"|"declined",
  timestamp: number
};

TALENT SCORING ENGINE (talentScoring.js):
calculateComposite(athlete):
  physicalScore (60%): average percentile of all recorded metrics vs age benchmarks
  mentalScore (25%): athlete.mentalScore (0-100)
  trustScore (15%): (verifiedAttestations / totalAttestations) × avgAttestorRep
  composite = physical × 0.6 + mental × 0.25 + trust × 0.15

compositeToRating(composite): map 0-100 → 1000-2500
  0-20 → 1000-1300 (Bronze)
  20-40 → 1300-1600 (Silver)
  40-60 → 1600-1900 (Gold)
  60-80 → 1900-2200 (Elite)
  80-100 → 2200-2500 (Prodigy)

calculatePercentile(value, benchmarks, ageGroup, gender):
  Compare against sai-benchmarks.json age/gender data. Return 0-100.

DISTRICTS DATA (tn-districts.json):
Array of 38 objects:
{ id, name, nameTamil, population, centerLat, centerLng, taluks: string[] }
Include ALL 38 Tamil Nadu districts:
Chennai, Coimbatore, Madurai, Tiruchirappalli, Salem, Tirunelveli, Erode,
Vellore, Thoothukudi, Dindigul, Thanjavur, Ranipet, Sivaganga, Karur,
Tiruvannamalai, Namakkal, Tiruppur, Cuddalore, Kanchipuram, Krishnagiri,
Dharmapuri, Nagapattinam, Villupuram, Virudhunagar, Theni, Perambalur,
Ariyalur, Nilgiris, Ramanathapuram, Pudukkottai, Kallakurichi, Chengalpattu,
Tirupattur, Tenkasi, Mayiladuthurai, Kanyakumari, Tiruvallur, Kanniyakumari

SAI BENCHMARKS (sai-benchmarks.json):
Structure: { "30m_sprint": { "U-12": { "male": { "good": 5.5, "excellent": 4.8 }, "female": {...} }, "U-14": {...}, ... }, "60m_sprint": {...}, ... }
Include benchmarks for all 8 SAI tests × 5 age groups × 2 genders.
Use realistic Sports Authority of India standards.

TALENT HEAT MAP (TalentHeatMap.jsx):
- SVG-based map of Tamil Nadu showing all 38 districts
- Create a simplified SVG with district boundaries (can use simplified polygon paths)
- Color coding: intensity based on number of athletes registered
  - 0 athletes: dark/grey
  - 1-10: light blue
  - 11-50: blue
  - 51-100: green
  - 100+: gold/orange
- Hover: show district name + athlete count + top sport
- Click: expand to show top 5 athletes in that district
- Smooth transitions on hover/click

SCOUT DASHBOARD (ScoutDashboard.jsx):
Desktop-optimized command center with tab navigation:
- Tab 1: Search & Filter → SearchFilters + results grid
- Tab 2: Heat Map → TalentHeatMap
- Tab 3: Rankings → AthleteRanking (leaderboard)
- Tab 4: Discovery Feed → DiscoveryFeed
- Tab 5: Recruitment → RecruitmentPortal

SEARCH FILTERS:
- Sport: dropdown (12 sports)
- Age Group: radio (U-12, U-14, U-16, U-18, U-21)
- Gender: radio (All, Male, Female)
- District: dropdown (38 districts)
- Min Talent Rating: range slider (1000-2500)
- Min Mental Score: range slider (0-100)
- Verified Only: toggle
- Sort By: dropdown (Rating, Mental Score, Recent, Specific metric)
Results: responsive card grid, each card shows mini-profile with key stats.
Click card → navigate to /profile/:id

ATHLETE RANKING (AthleteRanking.jsx):
- Tab for each sport
- Table: Rank, Name, Age, District, Talent Rating, Mental Score, Key Metric, Verified?
- Sortable columns
- Rating badge with color (Bronze→Prodigy gradient)
- Click row → navigate to full profile

DISCOVERY FEED (DiscoveryFeed.jsx):
- Live-updating list of recent assessments
- Each entry: "[Photo] Murugan K., 14, recorded 7.8s 60m Sprint in Dharmapuri — 85th Percentile ✓ Verified · 2 min ago"
- Auto-scroll with pause-on-hover
- For demo: seeded with 20 realistic entries across 5 districts, timestamps spread over last 24h
- Animated new entries sliding in from top

RECRUITMENT PORTAL (RecruitmentPortal.jsx):
- "Send Offer" button appears on athlete cards
- Modal form: Academy Name, Program Type (scholarship/training/trial/sponsorship), Value/Benefits, Duration, Location, Personal Message
- Submitted offers stored in state/context
- Shows "Offers Sent" list with status (pending/accepted/declined)

OFFER CARD (OfferCard.jsx):
- Used on athlete profile page (Rahul will import this from your file)
- Displays: academy logo placeholder, name, offer type, value, message
- Accept/Decline buttons
- Status badge: Pending (yellow), Accepted (green), Declined (red)

REVENUE CALCULATOR (RevenueCalculator.jsx):
- Interactive sliders:
  - Number of Academies (0-15,000, default 15,000)
  - Conversion Rate (0-20%, default 2%)
  - Monthly Price per Academy (₹499-₹9,999, default ₹999)
  - Government Contracts (0-38 states, default 5)
  - Govt Contract Value (₹10L-₹1Cr, default ₹25L)
- Calculated outputs (animate counting):
  - Monthly Revenue = academies × conversion × price
  - Annual Revenue = monthly × 12 + govt × govtValue
  - 3-Year Projection (20% YoY growth)
  - Total Addressable Market display

SCALE METRICS (ScaleMetrics.jsx):
- Animated counting numbers that roll up from 0
- Stats: Total Athletes (seed: 2,847), Districts Active (seed: 23/38), Scouts Registered (seed: 156), Assessments Recorded (seed: 12,430), Offers Sent (seed: 89), Schemes Matched (seed: 1,247)
- Use requestAnimationFrame for smooth counting animation
- Each stat: large number + label + trend arrow (↑ 23% this month)

Build production-quality. Data-dense but clean. Make scouts WANT to use this.
Push to feat/scout branch. Pull origin main before every push.
```
