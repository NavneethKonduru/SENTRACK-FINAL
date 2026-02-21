# Rahul — ATHLETE FLOW

## Role

Athlete registration, voice input, profiles, QR passport, i18n, mental profile, scheme matching.

## Branch: `feat/athlete`

## Setup

```bash
git clone https://github.com/Shadow-Joker/IMPROV.git
cd IMPROV && npm install
git checkout -b feat/athlete
npm run dev
```

## My Files (ONLY touch these)

```
src/components/athlete/RegisterForm.jsx
src/components/athlete/ProfileCard.jsx
src/components/athlete/QRPassport.jsx
src/components/athlete/SchemesMatcher.jsx
src/components/athlete/MentalProfileForm.jsx
src/components/athlete/MentalRadarChart.jsx
src/components/shared/VoiceInput.jsx
src/components/shared/LanguageToggle.jsx
src/hooks/useVoiceInput.js
src/utils/translations.js
src/utils/schemes.js
src/utils/mentalScoring.js
src/pages/Register.jsx
src/pages/AthleteProfile.jsx
```

## Page Exports

```javascript
// src/pages/Register.jsx
export default function Register() { ... }

// src/pages/AthleteProfile.jsx
export default function AthleteProfile() { ... }
```

## Task Checklist

- [ ] Clone + setup
- [ ] VoiceInput + useVoiceInput (Tamil/English)
- [ ] RegisterForm (voice-first)
- [ ] LanguageToggle
- [ ] translations.js (full Tamil/English)
- [ ] ProfileCard (LinkedIn-premium)
- [ ] QRPassport (QR code shareable)
- [ ] MentalProfileForm (15 questions)
- [ ] MentalRadarChart (5-axis)
- [ ] mentalScoring.js
- [ ] SchemesMatcher + schemes.js
- [ ] Register page
- [ ] AthleteProfile page
- [ ] Polish + responsive

## Sync Commands (every 2 hours)

```bash
git add . && git commit -m "progress: <what>" && git push origin feat/athlete
git pull origin main
```

---

## FULL ANTIGRAVITY PROMPT (paste this into your Antigravity session)

```
I'm Rahul on Team Flexinator building SENTRAK for NXTGEN'26 hackathon.
We're solving PS2: Grassroots Rural Athlete Talent Discovery Platform.

REPO: https://github.com/Shadow-Joker/IMPROV.git (already scaffolded on main)
MY BRANCH: feat/athlete

FIRST: Clone the repo, npm install, checkout feat/athlete, run dev server.

I own the ATHLETE FLOW. These are MY files (do NOT touch other files):

src/components/athlete/RegisterForm.jsx    — Voice-first registration form
src/components/athlete/ProfileCard.jsx     — LinkedIn-premium talent passport card
src/components/athlete/QRPassport.jsx      — QR-coded shareable profile
src/components/athlete/SchemesMatcher.jsx  — Government scheme auto-matching
src/components/athlete/MentalProfileForm.jsx — 15-question psych assessment (voice)
src/components/athlete/MentalRadarChart.jsx  — 5-axis radar chart (HTML5 Canvas or SVG)
src/components/shared/VoiceInput.jsx       — Tamil/English speech input component
src/components/shared/LanguageToggle.jsx   — Tamil ↔ English toggle button
src/hooks/useVoiceInput.js                 — Web Speech API hook (ta-IN + en-IN)
src/utils/translations.js                  — Complete Tamil/English string dictionary
src/utils/schemes.js                       — 50+ government sports scheme database
src/utils/mentalScoring.js                 — Mental profile scoring engine
src/pages/Register.jsx                     — Registration page wrapper
src/pages/AthleteProfile.jsx               — Full athlete passport page

CRITICAL DESIGN RULES:
1. Use CSS classes from src/index.css ONLY — no inline styles, no new CSS files
2. Import data shapes from src/utils/dataShapes.js — do NOT redefine
3. Dark premium theme with glassmorphism (backdrop-filter: blur)
4. Mobile-first responsive (works on cheap Android + desktop)
5. Every page component: export default function ComponentName()
6. Use React Router's useParams, useNavigate for navigation

DATA SHAPES (from dataShapes.js — import, don't redefine):
const ATHLETE = {
  id: string,           // crypto.randomUUID()
  name: string,         // English name
  nameTamil: string,    // Tamil name
  age: number,
  gender: "male"|"female"|"other",
  sport: string,        // from SPORTS list
  district: string,     // from TN districts
  village: string,
  photoURL: string,     // base64 from camera or empty
  talentRating: number, // 1000-2500 (calculated)
  mentalScore: number,  // 0-100 (from mental assessment)
  mentalProfile: { toughness, teamwork, drive, strategy, discipline }, // each 1-5
  assessments: [],
  attestations: [],
  schemes: [],          // matched scheme IDs
  createdAt: number,    // Date.now()
  syncStatus: "local"|"synced"
};

VOICE INPUT SYSTEM:
- Web Speech API with SpeechRecognition
- Languages: ta-IN (Tamil India), en-IN (English India)
- The VoiceInput component takes: { onResult, language, placeholder, fieldName }
- Shows mic button → user speaks → displays interim text → confirms → returns final
- useVoiceInput hook returns: { isListening, transcript, startListening, stopListening, error }
- Handle errors gracefully (no mic permission, speech not recognized)
- Fallback: text input always visible alongside voice button

THE APP TALKS TO USER (conversational UX):
- Registration flow: App asks each field via audio prompt
- Uses speechSynthesis API to speak prompts in Tamil
- Flow: App speaks question → user speaks answer → app confirms → next question
- Questions for registration: name, age, sport, district, village

MENTAL PROFILE ASSESSMENT (5 dimensions × 3 questions = 15):
1. Mental Toughness:
   - "When you lose a match, how quickly do you focus on the next one?" (1-5)
   - "How do you perform when people are watching?" (1-5)
   - "Can you maintain focus during a long training session?" (1-5)
2. Team Orientation:
   - "How important is winning as a team vs winning individually?" (1-5)
   - "How do you react to a teammate's mistake?" (1-5)
   - "Do you encourage teammates during practice?" (1-5)
3. Competitive Drive:
   - "How many hours/week do you practice without a coach?" (1-5 mapped)
   - "How do you feel about competing against stronger opponents?" (1-5)
   - "Do you set specific goals for each practice?" (1-5)
4. Strategic Thinking:
   - "Do you change strategy based on opponent?" (1-5)
   - "Can you identify weaknesses in opposing players?" (1-5)
   - "Do you analyze your past performances?" (1-5)
5. Discipline & Consistency:
   - "How often do you skip practice?" (reverse scored, 1-5)
   - "Do you follow a daily routine?" (1-5)
   - "How do you handle boring/repetitive training?" (1-5)

All questions have Tamil translations in translations.js.
Voice-asked: app speaks question, athlete answers, mapped to 1-5.
Results: radar chart (5 axes) + overall mental score (0-100).

GOVERNMENT SCHEMES (in schemes.js):
Each scheme: { id, name, nameTamil, eligibility: { maxAge, minAge, sports[], genders[], states[], minPerformancePercentile }, benefit: string, url: string }
Include at minimum:
- Khelo India Youth Games (U-21, any sport, ₹5L/year)
- Target Olympic Podium Scheme (elite, national level, ₹10L+)
- SAI Training Centers (U-14 to U-21, ₹2L/year)
- TN Chief Minister's Sports Development (TN residents, ₹1L)
- National Sports Development Fund (any, merit-based)
- Rural Sports Programme (rural athletes, ₹50K)
- Sports Scholarship Scheme (students, ₹25K-₹1L)
- SC/ST Sports Scholarship (reserved category, ₹75K)
- Women in Sports Initiative (female athletes, ₹1L)
- District Sports Development Fund (district level, ₹30K)
SchemesMatcher component: takes athlete object → filters eligible schemes → displays cards.

PROFILE CARD (LinkedIn-premium style):
- Hero section: photo + name + age + sport + district
- Talent Rating badge (Bronze/Silver/Gold/Elite/Prodigy)
- Mental Profile radar chart
- Recent assessments list with verification badges
- Matched government schemes
- QR code (links to /profile/:id)
- Share button (copies URL or triggered native share API)

QR PASSPORT:
- Uses qrcode.react library
- QR value = full URL to athlete profile
- Downloadable as image (canvas → blob → download)
- Printable layout (A5 card format)

Build EVERYTHING with production quality. Rich animations (CSS transitions).
Premium feel. Judges should think this is a funded startup, not students.
Push to feat/athlete branch. Pull origin main before every push.
```
