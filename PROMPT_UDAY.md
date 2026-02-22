# Uday's Prompt: Core Onboarding Orchestration & Athlete Registration

## Objective

Your goal is to intercept the user immediately after they successfully sign up with OTP, prevent them from accessing the main application until they fill out their profile, and build the specific registration form for the **Athlete** role.

## Technical Requirements

### 1. Intercept the Auth Flow

- Open `src/pages/Login.jsx`.
- Locate the `handleVerifyOTP` function. Currently, when `authAction === 'signup'`, it saves the role and routes the user to `/`.
- **Change this:** If the user is signing up for the first time, route them to `/onboarding` instead of `/`.
- Update `App.jsx` and `AuthContext`: Introduce an `onboardingComplete` boolean on the user document in Firestore. If `!onboardingComplete`, `<ProtectedRoute>` should force the user to `/onboarding` regardless of the URL they try to access.

### 2. Create the Master Onboarding Page

- Create a new page at `src/pages/Onboarding.jsx`.
- This page should read the user's `role` from the `AuthContext` and render the correct sub-form component (e.g., if role is 'athlete', render `<AthleteForm />`, if 'scout', render `<ScoutForm />` from Sharvesh, etc.).

### 3. Build the Athlete Registration Form

- Create a component `src/components/onboarding/AthleteForm.jsx`.
- **Required Fields:**
  - Full Name (Text)
  - Date of Birth (Date picker - auto-calculate age and save it)
  - Gender (Dropdown: Male, Female, Other)
  - Primary Sport (Dropdown based on sports list)
  - District (Dropdown: Check `src/utils/dataShapes.js` for Tamil Nadu districts)
  - Height in cm (Number)
  - Weight in kg (Number)
- **Submission Logic:** On submit, merge this data into the user's Firestore document (collection: `users`, document: `user.uid`). Add a flag `onboardingComplete: true`.
- Once saved successfully, navigate the user to `/` and trigger a success toast.

### 4. Build the Scout Registration Form (Re-assigned from Sharvesh)

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
- **Submission Logic:** On submit, ensure you pass `onboardingComplete: true` in the update payload and route them to `/scout`.

## Key Considerations

- Ensure the forms are mobile-responsive and use the `glass-card` CSS structure to match the rest of the application's premium aesthetic.
- Make sure to coordinate with Rahul so he can plug his Coach and Witness forms into your `Onboarding.jsx` page.
