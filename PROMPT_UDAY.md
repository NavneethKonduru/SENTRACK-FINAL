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

## Key Considerations

- Ensure the form is mobile-responsive and uses the `glass-card` CSS structure to match the rest of the application's premium aesthetic.
- Make sure to coordinate with Sharvesh and Rahul so they can plug their respective role forms into your `Onboarding.jsx` page.
