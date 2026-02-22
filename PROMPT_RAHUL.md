# Rahul's Prompt: Coach & Witness Onboarding Flows

## Objective

Your goal is to build the profile completion forms specifically for the **Coach / Academy** role and the **Witness** role. You will build two separate components and plug them into the master `/onboarding` page being orchestrated by Uday.

## Technical Requirements

### 1. Build the Coach Registration Form

- Create a component `src/components/onboarding/CoachForm.jsx`.
- **Required Fields:**
  - Full Name (Text)
  - Academy, School, or Organization Name (Text)
  - District of Operation (Dropdown)
  - Primary Sports Handled (Multi-select or comma-separated Text)
  - Coach Certification Level (Dropdown Options: None, NIS Diploma, State Level, National Level, Independent)

### 2. Build the Witness Registration Form

- Create a component `src/components/onboarding/WitnessForm.jsx`.
- The witness acts as the trust layer for the platform, cryptographically signing assessments.
- **Required Fields:**
  - Full Name (Text)
  - Official Designation (e.g., Panchayat President, School Headmaster, Government Official) (Text)
  - District (Dropdown)
  - Official ID Document Type (Dropdown: Aadhar, Voter ID, PAN Card, Official Employment ID) - _Note: No file upload is needed right now, just select the ID type._

### 3. Submission Logic

- Both forms must validate that all fields are filled before allowing submission.
- On submit, update the Firestore `users` collection document for the current `user.uid`.
- Save the form data under a `profileData` object and ensure you pass `onboardingComplete: true` in the update payload.
- Once saved successfully, navigate the user to `/` (which will load their specific Dashboard/Vault) and display a success toast ("Coach Profile created successfully" or "Witness Profile verified").

## Key Considerations

- Coordinate with Uday to ensure your `<CoachForm />` and `<WitnessForm />` components are imported into the main `Onboarding.jsx` page and rendered correctly.
- Ensure the design matches the application's clean, dark UI utilizing the `glass-card` styling for form containers.
