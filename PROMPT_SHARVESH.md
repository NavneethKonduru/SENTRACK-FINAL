# Sharvesh's Prompt: Scout Onboarding Flow

## Objective

Your goal is to build the profile completion form specifically for the **Scout / Recruiter** role. You will plug your form into the master `/onboarding` page being orchestrated by Uday.

## Technical Requirements

### 1. Build the Scout Registration Form

- Create a component `src/components/onboarding/ScoutForm.jsx`.
- The scout registration is unique because a scout can either be representing a formal institution or acting as an independent freelancer.
- **Required Base Fields:**
  - Full Name (Text)
  - District / Base of Operations (Dropdown)
- **Conditional Branching (Crucial Step):**
  - Implement a Toggle/Radio switch: **"Institute/Franchise"** vs **"Independent / Individual"**.
- **If Institute/Franchise is selected, ask for:**
  - Institute/Academy/Franchise Name (Text)
  - Official Designation (e.g., 'Head Talent Scout', 'Analyst') (Text)
  - Organization Registration Number (Optional Text)
- **If Individual is selected, ask for:**
  - Years of Scouting Experience (Number)
  - Freelance Affiliation / Previous Clubs (Optional Text)

### 2. Submission Logic

- The form should validate that all required fields for the chosen branch are filled.
- On submit, update the Firestore `users` collection document for the current `user.uid`.
- Save the data under a `profileData` object and ensure you pass `onboardingComplete: true` in the update payload.
- After successful Firestore update, use React Router to navigate them to the scout dashboard (`/scout`) and show a "Welcome Scout" toast notification.

## Key Considerations

- Sync with Uday to ensure your `<ScoutForm />` is correctly imported and rendered inside `Onboarding.jsx` when the user's role is 'scout'.
- Keep the UI consistent with the app's dark theme and glassmorphism styling. Use `animate-fade-in` for form appearances.
