# SENTRAK — PPT Content for NXTGEN'26

---

## Slide 1: Title

**SENTRAK** — Grassroots Talent Discovery for Rural India
Team Flexinator | NXTGEN'26 Hackathon

---

## Slide 2: The Problem

> 2.3 million rural athletes in Tamil Nadu have ZERO digital proof of their talent.

- No standardized assessments → scouts can't compare athletes across districts
- Paper records get lost, fabricated, or never created
- Government sports schemes worth ₹500+ crore go unclaimed because athletes can't prove eligibility
- Scouts only visit urban academies → 90% of rural talent is invisible

---

## Slide 3: Our Solution — SENTRAK

A **mobile-first, offline-capable PWA** that creates tamper-proof digital talent passports for rural athletes.

**Three pillars:**

1. 📝 **Voice-First Registration** — Tamil voice input, zero typing needed
2. ⏱️ **SAI-Standardized Assessment** — 8-test battery + sport-specific metrics with built-in stopwatch
3. 🛡️ **Community Attestation** — 3 witnesses + OTP verification + SHA-256 hash = tamper-proof

---

## Slide 4: Technical Architecture

```
┌─────────────────────────────────────────────────────┐
│                    SENTRAK PWA                       │
│              (React 18 + Vite + PWA)                │
├──────────┬──────────────┬──────────────┬────────────┤
│ ATHLETE  │  ASSESSMENT  │    SCOUT     │   SHARED   │
│ MODULE   │   ENGINE     │  DASHBOARD   │   LAYER    │
├──────────┼──────────────┼──────────────┼────────────┤
│Register  │SAITestEngine │TalentHeatMap │Firebase    │
│Form      │TimerWidget   │DiscoveryFeed │Auth+Store  │
│(voice)   │MetricsRecord │SearchFilters │            │
│          │              │              │            │
│Profile   │Attestation   │AthleteRank   │IndexedDB   │
│Card      │Form (OTP)    │RecruitPortal │(offline)   │
│          │              │              │            │
│QR        │FraudDetect   │RevenueCalc   │demoLoader  │
│Passport  │HashVerify    │OfferCard     │Toast/Error │
│          │              │              │            │
│Mental    │VideoClip     │ScaleMetrics  │translations│
│Radar     │Capture       │              │(EN/Tamil)  │
├──────────┴──────────────┴──────────────┴────────────┤
│          Offline-First Data Layer (IDB + localStorage) │
├─────────────────────────────────────────────────────┤
│     Firebase Firestore (sync when online)           │
└─────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer      | Technology                       | Why                                                    |
| ---------- | -------------------------------- | ------------------------------------------------------ |
| Frontend   | React 18 + Vite                  | Fast dev, hot reload, component architecture           |
| Styling    | Custom CSS Design System         | Dark premium theme, glassmorphism, 50+ utility classes |
| PWA        | vite-plugin-pwa + Service Worker | Works offline on 2G networks                           |
| Database   | Firebase Firestore               | Real-time sync when online                             |
| Offline DB | IndexedDB (idb) + localStorage   | Zero data loss in rural areas                          |
| Auth       | Firebase Auth                    | Phone OTP for coaches                                  |
| Hashing    | Web Crypto API (SHA-256)         | Tamper-proof assessment records                        |
| Voice      | Web Speech API                   | Tamil + English voice-first input                      |
| QR         | qrcode.react                     | Scannable talent passports                             |
| Charts     | Custom SVG                       | No library dependency, hand-built radar charts         |
| Icons      | Lucide React                     | Lightweight, tree-shakeable                            |

---

## Slide 5: Data Flow Diagram

```
  ATHLETE                    COACH                     SCOUT
    │                          │                          │
    ▼                          ▼                          ▼
┌─────────┐            ┌──────────────┐          ┌──────────────┐
│ Register │            │ Record       │          │ Search &     │
│ (Voice)  │            │ Assessment   │          │ Filter       │
│ Tamil/EN │            │ SAI 8-Test   │          │ Athletes     │
└────┬─────┘            │ + Sport-     │          └──────┬───────┘
     │                  │   Specific   │                 │
     ▼                  └──────┬───────┘                 ▼
┌─────────┐                    │                 ┌──────────────┐
│ Digital  │                   ▼                 │ Talent       │
│ Talent   │◄──────── ┌──────────────┐           │ Heat Map     │
│ Passport │          │ 3 Witnesses  │           │ (TN State)   │
│ (QR)     │          │ OTP Verify   │           └──────┬───────┘
└────┬─────┘          │ SHA-256 Hash │                  │
     │                └──────┬───────┘                  ▼
     ▼                       │                  ┌──────────────┐
┌─────────┐                  ▼                  │ Make Offer / │
│ Scheme   │          ┌──────────────┐          │ Scholarship  │
│ Matcher  │          │ TAMPER-PROOF │          │ to Athlete   │
│ ₹5L+    │          │ RECORD       │          └──────────────┘
└─────────┘          └──────────────┘
```

---

## Slide 6: User Flow (90-Second Demo)

| Step | Time   | What Happens                                                          |
| ---- | ------ | --------------------------------------------------------------------- |
| 1    | 0-10s  | Open app → Landing page with animated stats, feature cards            |
| 2    | 10-25s | Register athlete using Tamil voice → name, age, sport, district       |
| 3    | 25-40s | Run SAI assessment → start timer, record 30m sprint time              |
| 4    | 40-55s | 3 community witnesses verify via OTP → SHA-256 hash generated         |
| 5    | 55-65s | View athlete profile → Talent Passport + QR code + mental radar chart |
| 6    | 65-75s | Government scheme matcher → "You qualify for ₹5,00,000 Khelo India!"  |
| 7    | 75-90s | Scout dashboard → TN heat map, search filters, make offer             |

---

## Slide 7: Unique Selling Point (USP)

### 🛡️ Community-Verified Tamper-Proof Records

**What makes SENTRAK different from every other sports tech platform:**

Traditional sports platforms rely on **self-reported data** — athletes or coaches claim "I ran 100m in 11.2s" with no proof. This is easily fabricated.

SENTRAK introduces **Community Attestation Protocol:**

1. **3 Independent Witnesses** — Each assessment requires 3 community members (teachers, village heads, parents) to verify they watched the test happen
2. **OTP Verification** — Each witness receives a one-time password on their phone, proving identity
3. **SHA-256 Cryptographic Hash** — The assessment data + witness identities are hashed together. Any tampering changes the hash → instantly detectable
4. **Fraud Detection Engine** — Automatic flagging of physically impossible values (e.g., "100m in 8.5s for a 14-year-old") and suspicious attestor patterns

**Result:** Every record on SENTRAK is **community-verified + cryptographically sealed**. Scouts and government officials can trust the data without visiting the village.

> "It's like a blockchain for sports talent — but without the blockchain overhead."

---

## Slide 8: Current Status of Prototype

### ✅ What's Built & Working (as of 8:30 PM, Feb 21)

| Module                    | Status      | Key Features                                                               |
| ------------------------- | ----------- | -------------------------------------------------------------------------- |
| **Registration**          | ✅ Complete | 6-step voice-first form, Tamil/English, camera photo, TN districts         |
| **Assessment Engine**     | ✅ Complete | SAI 8-test battery, sport-specific metrics, precision timer with countdown |
| **Community Attestation** | ✅ Complete | 3-witness OTP flow, SHA-256 hash verification, fraud detection             |
| **Athlete Profile**       | ✅ Complete | Premium card, QR passport, mental radar chart, scheme matcher              |
| **Scout Dashboard**       | ✅ Complete | TN heat map, discovery feed, search filters, rankings                      |
| **Design System**         | ✅ Complete | Dark premium theme, glassmorphism, 50+ utility classes, animations         |
| **Offline Support**       | ✅ Complete | IndexedDB + localStorage fallback, offline queue, auto-sync                |
| **Localization**          | ✅ Complete | Full Tamil + English with voice input                                      |

### 📊 By the Numbers

- **70+ files** across the codebase
- **20,000+ lines** of production code
- **4 parallel developers** working autonomously
- **12 merge cycles** completed without conflicts
- **0 blocking bugs** — all flows tested end-to-end

---

## Slide 9: Plan of Action (Next 24 Hours)

### Objectives & Expected Outcomes

| Time              | Action                    | Expected Outcome                                        |
| ----------------- | ------------------------- | ------------------------------------------------------- |
| **Now – 22:00**   | Final integration testing | All 3 flows (register → assess → scout) work seamlessly |
| **22:00 – 23:00** | Vercel deployment         | Live URL + QR code for judges to test on their phones   |
| **23:00 – 00:00** | Demo rehearsal            | 90-second walkthrough perfected, backup video recorded  |
| **00:00 – 02:00** | Edge case fixing          | Offline mode tested, cross-browser verified             |
| **02:00 – 06:00** | Buffer / Sleep            | Contingency time for unexpected issues                  |
| **06:00 – 08:00** | Final polish              | Landing page particles, animation tweaks                |
| **08:00 – 09:00** | Presentation prep         | PPT finalized, talking points rehearsed                 |
| **09:00+**        | Demo day                  | Live demo + pitch                                       |

### Remaining Milestones

1. ✅ ~~Core features built~~ (DONE)
2. ✅ ~~UI polish~~ (DONE)
3. ✅ ~~Integration across modules~~ (DONE)
4. 🔲 Vercel deploy (1 hour)
5. 🔲 Demo video recording (30 min)
6. 🔲 Final presentation polish (1 hour)

---

## Slide 10: Impact & Scale

### Why This Matters

- **2.3M** rural athletes in TN alone → **40M+** across India
- **₹500+ crore** in government sports schemes go unclaimed annually
- **90%** of talent scouting happens in urban academies only
- **Zero** existing platforms work offline on 2G networks

### Revenue Model

| Stream                              | Year 1                      | Year 3                |
| ----------------------------------- | --------------------------- | --------------------- |
| Government licensing (per district) | ₹38L/district × 5 = ₹1.9 Cr | ₹38L × 38 = ₹14.4 Cr  |
| Scout subscriptions (₹999/mo)       | 200 scouts = ₹24L           | 2000 scouts = ₹2.4 Cr |
| Assessment certification fees       | ₹10/test × 50K = ₹5L        | ₹10 × 1M = ₹1 Cr      |
| **Total ARR**                       | **₹2.19 Cr**                | **₹17.8 Cr**          |

---

## Slide 11: Team

| Member       | Role              | Contribution                                                            |
| ------------ | ----------------- | ----------------------------------------------------------------------- |
| **Navneeth** | Architect         | Scaffold, design system, integration layer, App.jsx, merge coordination |
| **Rahul**    | Athlete Module    | Registration, profiles, QR passport, mental assessment, localization    |
| **Sharvesh** | Assessment Engine | SAI tests, timer, attestation, fraud detection, offline DB, hashing     |
| **Uday**     | Scout Dashboard   | Heat map, discovery feed, search filters, rankings, recruitment portal  |
