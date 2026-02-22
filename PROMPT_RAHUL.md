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

---

## 🔥 PHASE 5: Witness Verification Center (The Final Sprint)

If you finish the registration forms early, move directly to this core trust feature.

### 1. Build the Witness Dashboard

- Create `src/pages/WitnessDashboard.jsx`.
- **Requirements:**
  - Fetch a list of assessments from Firestore where `status: 'pending_verification'`.
  - Display them as a list of "Pending Approval" cards showing Athlete Name, Sport, and the Coach who recorded it.

### 2. Implement the "Seal of Approval" Logic

- When a Witness clicks "Verify" on an assessment card, open a modal with the `AttestationForm`.
- The Witness must enter the OTP (In demo mode, use the generated code; in production, this would be a real SMS).
- **Crucial:** Once verified, update the assessment document in Firestore:
  - Set `status: 'verified'`
  - Add `verifiedBy: witnessUid`
  - Add `verifiedAt: serverTimestamp()`
- Success should update the UI immediately and show a celebratory toast.
