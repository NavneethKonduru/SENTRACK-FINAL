# 🎯 SENTRAK — Team Coordination Hub

> **Repo:** `https://github.com/Shadow-Joker/IMPROV.git`
> **Hackathon:** NXTGEN'26 | Feb 21 12PM → Feb 22 9AM IST

---

## 🔴 CURRENT STATUS

| Member   | Branch            | Status             | Last Push |
| -------- | ----------------- | ------------------ | --------- |
| Navneeth | `main`            | 🟢 SCAFFOLD PUSHED | --        |
| Rahul    | `feat/athlete`    | ⬜ WAITING         | --        |
| Sharvesh | `feat/assessment` | ⬜ WAITING         | --        |
| Uday     | `feat/scout`      | ⬜ WAITING         | --        |

## ⚡ MERGE SCHEDULE

| Time  | Merge # | Status |
| ----- | ------- | ------ |
| 16:00 | Merge 1 | ⬜     |
| 18:30 | Merge 2 | ⬜     |
| 22:30 | Merge 3 | ⬜     |
| 00:30 | Merge 4 | ⬜     |
| 01:30 | FREEZE  | ⬜     |

## 📐 SHARED DATA CONTRACTS

All devs import from `src/utils/dataShapes.js` — **DO NOT redefine these shapes.**

## 🎨 DESIGN SYSTEM

All devs use CSS classes from `src/index.css` — **DO NOT create inline styles or new CSS files.**

## 🚨 RULES

1. **ONLY edit files in YOUR ownership list** (see your personal .md file)
2. **NEVER edit** `App.jsx`, `main.jsx`, `index.css`, `firebase.js` — Navneeth only
3. **Push to YOUR branch** every 2 hours
4. **Pull main** before every push: `git pull origin main`
5. **Component exports:** Every page component must `export default` and follow naming in `App.jsx` routes
6. **Import paths:** Use relative imports from your files, import shared utils from `src/utils/`
7. Update YOUR `.teamhub/<NAME>.md` status when you complete a task

## 🔗 COMPONENT INTERFACE CONTRACTS

### Pages (each dev exports these for App.jsx routing)

```
Rahul:    Register (src/pages/Register.jsx)
          AthleteProfile (src/pages/AthleteProfile.jsx)
Sharvesh: RecordAssessment (src/pages/RecordAssessment.jsx)
          Challenges (src/pages/Challenges.jsx)
Uday:     ScoutView (src/pages/ScoutView.jsx)
```

### How Pages Connect

```
Landing → "Register Athlete" btn → /register (Rahul)
Landing → "Record Assessment" btn → /assess (Sharvesh)
Landing → "Scout Dashboard" btn → /scout (Uday)
Register → after submit → /profile/:id (Rahul)
Profile → "New Assessment" btn → /assess/:athleteId (Sharvesh)
Profile → shows QR code → scanned → /profile/:id
Scout → clicks athlete card → /profile/:id (Rahul)
Scout → "Challenges" tab → /challenges (Sharvesh)
```
