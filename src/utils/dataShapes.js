/* ========================================
   SENTRAK — Shared Data Shapes
   ALL devs import from here. DO NOT redefine.
   ======================================== */

export const SPORTS = [
  'Cricket', 'Football', 'Kabaddi', 'Hockey', 'Badminton', 'Wrestling',
  'Athletics_Track', 'Athletics_Field', 'Swimming', 'Boxing', 'Archery', 'Weightlifting'
];

export const AGE_GROUPS = ['U-12', 'U-14', 'U-16', 'U-18', 'U-21'];

export const GENDERS = ['male', 'female', 'other'];

export const RATING_TIERS = [
  { min: 1000, max: 1300, name: 'Bronze', class: 'badge-bronze' },
  { min: 1300, max: 1600, name: 'Silver', class: 'badge-silver' },
  { min: 1600, max: 1900, name: 'Gold', class: 'badge-gold' },
  { min: 1900, max: 2200, name: 'Elite', class: 'badge-elite' },
  { min: 2200, max: 2500, name: 'Prodigy', class: 'badge-prodigy' },
];

export function getRatingTier(rating) {
  return RATING_TIERS.find(t => rating >= t.min && rating < t.max) || RATING_TIERS[RATING_TIERS.length - 1];
}

export function getAgeGroup(age) {
  if (age < 12) return 'U-12';
  if (age < 14) return 'U-14';
  if (age < 16) return 'U-16';
  if (age < 18) return 'U-18';
  return 'U-21';
}

export function createAthlete(data = {}) {
  return {
    id: crypto.randomUUID(),
    name: '',
    nameTamil: '',
    age: 0,
    gender: 'male',
    sport: '',
    district: '',
    village: '',
    photoURL: '',
    talentRating: 1000,
    mentalScore: 0,
    mentalProfile: {
      toughness: 0,
      teamwork: 0,
      drive: 0,
      strategy: 0,
      discipline: 0,
    },
    assessments: [],
    attestations: [],
    schemes: [],
    offers: [],
    createdAt: Date.now(),
    syncStatus: 'local',
    ...data,
  };
}

export function createAssessment(data = {}) {
  return {
    id: crypto.randomUUID(),
    athleteId: '',
    sport: '',
    testType: '',
    testCategory: 'sai', // 'sai' | 'sport_specific'
    value: 0,
    unit: '',
    percentile: 0,
    videoClipURL: '',
    hash: '',
    attestations: [],
    flags: [],
    timestamp: Date.now(),
    syncStatus: 'local',
    ...data,
  };
}

export function createAttestation(data = {}) {
  return {
    id: crypto.randomUUID(),
    assessmentId: '',
    witnessName: '',
    witnessPhone: '',
    otpVerified: false,
    timestamp: Date.now(),
    ...data,
  };
}

export function createChallenge(data = {}) {
  return {
    id: crypto.randomUUID(),
    title: '',
    sport: '',
    testType: '',
    ageGroup: 'U-16',
    district: '',
    startDate: Date.now(),
    endDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
    entries: [],
    status: 'active',
    ...data,
  };
}

export function createOffer(data = {}) {
  return {
    id: crypto.randomUUID(),
    scoutId: '',
    scoutName: '',
    academyName: '',
    athleteId: '',
    type: 'scholarship', // 'scholarship' | 'training' | 'trial' | 'sponsorship'
    value: '',
    duration: '',
    location: '',
    message: '',
    status: 'pending', // 'pending' | 'accepted' | 'declined'
    timestamp: Date.now(),
    ...data,
  };
}

/* Demo seed data — 10 realistic athletes */
export const DEMO_ATHLETES = [
  createAthlete({ id: 'demo-1', name: 'Murugan K.', nameTamil: 'முருகன் கே.', age: 14, gender: 'male', sport: 'Athletics_Track', district: 'Dharmapuri', village: 'Pennagaram', talentRating: 1950, mentalScore: 78, mentalProfile: { toughness: 4.2, teamwork: 3.5, drive: 4.8, strategy: 3.8, discipline: 4.5 }, syncStatus: 'synced' }),
  createAthlete({ id: 'demo-2', name: 'Lakshmi R.', nameTamil: 'லக்ஷ்மி ஆர்.', age: 16, gender: 'female', sport: 'Kabaddi', district: 'Tirunelveli', village: 'Ambasamudram', talentRating: 2100, mentalScore: 85, mentalProfile: { toughness: 4.5, teamwork: 4.8, drive: 4.2, strategy: 4.0, discipline: 4.7 }, syncStatus: 'synced' }),
  createAthlete({ id: 'demo-3', name: 'Arjun S.', nameTamil: 'அர்ஜுன் எஸ்.', age: 15, gender: 'male', sport: 'Cricket', district: 'Salem', village: 'Attur', talentRating: 1800, mentalScore: 82, mentalProfile: { toughness: 3.8, teamwork: 4.2, drive: 4.5, strategy: 4.8, discipline: 4.0 }, syncStatus: 'synced' }),
  createAthlete({ id: 'demo-4', name: 'Priya M.', nameTamil: 'பிரியா எம்.', age: 13, gender: 'female', sport: 'Badminton', district: 'Madurai', village: 'Melur', talentRating: 1700, mentalScore: 88, mentalProfile: { toughness: 4.0, teamwork: 3.2, drive: 4.8, strategy: 4.5, discipline: 5.0 }, syncStatus: 'synced' }),
  createAthlete({ id: 'demo-5', name: 'Karthik V.', nameTamil: 'கார்த்திக் வி.', age: 17, gender: 'male', sport: 'Football', district: 'Coimbatore', village: 'Pollachi', talentRating: 2250, mentalScore: 91, mentalProfile: { toughness: 4.8, teamwork: 5.0, drive: 4.5, strategy: 4.2, discipline: 4.3 }, syncStatus: 'synced' }),
  createAthlete({ id: 'demo-6', name: 'Saranya T.', nameTamil: 'சரண்யா டி.', age: 14, gender: 'female', sport: 'Athletics_Track', district: 'Thanjavur', village: 'Kumbakonam', talentRating: 1650, mentalScore: 72, mentalProfile: { toughness: 3.5, teamwork: 3.8, drive: 4.0, strategy: 3.2, discipline: 4.2 }, syncStatus: 'synced' }),
  createAthlete({ id: 'demo-7', name: 'Ravi D.', nameTamil: 'ரவி டி.', age: 16, gender: 'male', sport: 'Wrestling', district: 'Dharmapuri', village: 'Harur', talentRating: 1900, mentalScore: 80, mentalProfile: { toughness: 5.0, teamwork: 3.0, drive: 4.5, strategy: 3.5, discipline: 4.8 }, syncStatus: 'synced' }),
  createAthlete({ id: 'demo-8', name: 'Anitha B.', nameTamil: 'அனிதா பி.', age: 15, gender: 'female', sport: 'Hockey', district: 'Salem', village: 'Mettur', talentRating: 1750, mentalScore: 76, mentalProfile: { toughness: 4.0, teamwork: 4.5, drive: 3.8, strategy: 4.2, discipline: 3.7 }, syncStatus: 'synced' }),
  createAthlete({ id: 'demo-9', name: 'Surya P.', nameTamil: 'சூர்யா பி.', age: 18, gender: 'male', sport: 'Boxing', district: 'Madurai', village: 'Usilampatti', talentRating: 2050, mentalScore: 86, mentalProfile: { toughness: 4.8, teamwork: 3.0, drive: 5.0, strategy: 4.0, discipline: 4.5 }, syncStatus: 'synced' }),
  createAthlete({ id: 'demo-10', name: 'Divya K.', nameTamil: 'திவ்யா கே.', age: 13, gender: 'female', sport: 'Archery', district: 'Coimbatore', village: 'Valparai', talentRating: 1550, mentalScore: 90, mentalProfile: { toughness: 4.2, teamwork: 3.5, drive: 4.5, strategy: 4.8, discipline: 5.0 }, syncStatus: 'synced' }),
];

/* Demo assessments for demo athletes */
export const DEMO_ASSESSMENTS = [
  createAssessment({ id: 'assess-1', athleteId: 'demo-1', sport: 'Athletics_Track', testType: '60m_sprint', testCategory: 'sai', value: 7.8, unit: 's', percentile: 85, hash: 'a3f2...verified', attestations: [{ witnessName: 'Coach Kumar', otpVerified: true }, { witnessName: 'Rajan P.', otpVerified: true }, { witnessName: 'Selvi M.', otpVerified: true }], syncStatus: 'synced' }),
  createAssessment({ id: 'assess-2', athleteId: 'demo-1', sport: 'Athletics_Track', testType: '30m_sprint', testCategory: 'sai', value: 4.3, unit: 's', percentile: 88, hash: 'b7c1...verified', attestations: [{ witnessName: 'Coach Kumar', otpVerified: true }, { witnessName: 'Rajan P.', otpVerified: true }, { witnessName: 'Selvi M.', otpVerified: true }], syncStatus: 'synced' }),
  createAssessment({ id: 'assess-3', athleteId: 'demo-2', sport: 'Kabaddi', testType: 'raid_success', testCategory: 'sport_specific', value: 72, unit: '%', percentile: 92, hash: 'c9d3...verified', attestations: [{ witnessName: 'Coach Muthu', otpVerified: true }, { witnessName: 'Lakshman', otpVerified: true }, { witnessName: 'Devi S.', otpVerified: true }], syncStatus: 'synced' }),
  createAssessment({ id: 'assess-4', athleteId: 'demo-3', sport: 'Cricket', testType: 'bowling_speed', testCategory: 'sport_specific', value: 110, unit: 'km/h', percentile: 78, hash: 'd5e2...verified', attestations: [{ witnessName: 'Coach Raj', otpVerified: true }, { witnessName: 'Suresh K.', otpVerified: true }, { witnessName: 'Venkat R.', otpVerified: true }], syncStatus: 'synced' }),
  createAssessment({ id: 'assess-5', athleteId: 'demo-5', sport: 'Football', testType: 'sprint_40m', testCategory: 'sport_specific', value: 5.4, unit: 's', percentile: 90, hash: 'e8f4...verified', attestations: [{ witnessName: 'Coach Arun', otpVerified: true }, { witnessName: 'Prasad M.', otpVerified: true }, { witnessName: 'Geetha V.', otpVerified: true }], syncStatus: 'synced' }),
  createAssessment({ id: 'assess-6', athleteId: 'demo-4', sport: 'Badminton', testType: 'agility_test', testCategory: 'sport_specific', value: 9.2, unit: 's', percentile: 85, hash: 'bad1...verified', attestations: [{ witnessName: 'Coach Kumar', otpVerified: true }, { witnessName: 'Siva T.', otpVerified: true }, { witnessName: 'Rani K.', otpVerified: true }], syncStatus: 'synced' }),
  createAssessment({ id: 'assess-7', athleteId: 'demo-4', sport: 'Badminton', testType: 'standing_broad_jump', testCategory: 'sai', value: 1.8, unit: 'm', percentile: 80, hash: 'bad2...verified', attestations: [{ witnessName: 'Coach Kumar', otpVerified: true }, { witnessName: 'Siva T.', otpVerified: true }, { witnessName: 'Rani K.', otpVerified: true }], syncStatus: 'synced' }),
  createAssessment({ id: 'assess-8', athleteId: 'demo-6', sport: 'Athletics_Track', testType: '600m_run', testCategory: 'sai', value: 125, unit: 's', percentile: 72, hash: 'trk1...verified', attestations: [{ witnessName: 'Coach Rajan', otpVerified: true }, { witnessName: 'Devi P.', otpVerified: true }, { witnessName: 'Murugan S.', otpVerified: true }], syncStatus: 'synced' }),
  createAssessment({ id: 'assess-9', athleteId: 'demo-6', sport: 'Athletics_Track', testType: 'vertical_jump', testCategory: 'sai', value: 45, unit: 'cm', percentile: 68, hash: 'trk2...verified', attestations: [{ witnessName: 'Coach Rajan', otpVerified: true }, { witnessName: 'Devi P.', otpVerified: true }, { witnessName: 'Murugan S.', otpVerified: true }], syncStatus: 'synced' }),
  createAssessment({ id: 'assess-10', athleteId: 'demo-7', sport: 'Wrestling', testType: 'flexibility_sit_reach', testCategory: 'sai', value: 15, unit: 'cm', percentile: 88, hash: 'wre1...verified', attestations: [{ witnessName: 'Coach Singam', otpVerified: true }, { witnessName: 'Velu K.', otpVerified: true }, { witnessName: 'Mani R.', otpVerified: true }], syncStatus: 'synced' }),
  createAssessment({ id: 'assess-11', athleteId: 'demo-7', sport: 'Wrestling', testType: 'grip_strength', testCategory: 'sport_specific', value: 45, unit: 'kg', percentile: 90, hash: 'wre2...verified', attestations: [{ witnessName: 'Coach Singam', otpVerified: true }, { witnessName: 'Velu K.', otpVerified: true }, { witnessName: 'Mani R.', otpVerified: true }], syncStatus: 'synced' }),
  createAssessment({ id: 'assess-12', athleteId: 'demo-8', sport: 'Hockey', testType: 'dribble_speed', testCategory: 'sport_specific', value: 14.5, unit: 's', percentile: 75, hash: 'hoc1...verified', attestations: [{ witnessName: 'Coach Babu', otpVerified: true }, { witnessName: 'Priya S.', otpVerified: true }, { witnessName: 'Anand T.', otpVerified: true }], syncStatus: 'synced' }),
  createAssessment({ id: 'assess-13', athleteId: 'demo-8', sport: 'Hockey', testType: 'shuttle_run_4x10m', testCategory: 'sai', value: 11.2, unit: 's', percentile: 78, hash: 'hoc2...verified', attestations: [{ witnessName: 'Coach Babu', otpVerified: true }, { witnessName: 'Priya S.', otpVerified: true }, { witnessName: 'Anand T.', otpVerified: true }], syncStatus: 'synced' }),
  createAssessment({ id: 'assess-14', athleteId: 'demo-9', sport: 'Boxing', testType: 'punch_speed', testCategory: 'sport_specific', value: 5.2, unit: 'm/s', percentile: 86, hash: 'box1...verified', attestations: [{ witnessName: 'Coach Tyson', otpVerified: true }, { witnessName: 'Rocky B.', otpVerified: true }, { witnessName: 'Apollo C.', otpVerified: true }], syncStatus: 'synced' }),
  createAssessment({ id: 'assess-15', athleteId: 'demo-9', sport: 'Boxing', testType: 'reaction_time', testCategory: 'sport_specific', value: 0.18, unit: 's', percentile: 92, hash: 'box2...verified', attestations: [{ witnessName: 'Coach Tyson', otpVerified: true }, { witnessName: 'Rocky B.', otpVerified: true }, { witnessName: 'Apollo C.', otpVerified: true }], syncStatus: 'synced' }),
  createAssessment({ id: 'assess-16', athleteId: 'demo-10', sport: 'Archery', testType: 'target_accuracy', testCategory: 'sport_specific', value: 92, unit: '%', percentile: 94, hash: 'arc1...verified', attestations: [{ witnessName: 'Coach Dhanush', otpVerified: true }, { witnessName: 'Arjun P.', otpVerified: true }, { witnessName: 'Karna S.', otpVerified: true }], syncStatus: 'synced' }),
  createAssessment({ id: 'assess-17', athleteId: 'demo-10', sport: 'Archery', testType: 'bow_draw_weight', testCategory: 'sport_specific', value: 32, unit: 'lbs', percentile: 85, hash: 'arc2...verified', attestations: [{ witnessName: 'Coach Dhanush', otpVerified: true }, { witnessName: 'Arjun P.', otpVerified: true }, { witnessName: 'Karna S.', otpVerified: true }], syncStatus: 'synced' }),
  createAssessment({ id: 'assess-18', athleteId: 'demo-2', sport: 'Kabaddi', testType: 'standing_broad_jump', testCategory: 'sai', value: 2.1, unit: 'm', percentile: 89, hash: 'kab2...verified', attestations: [{ witnessName: 'Coach Muthu', otpVerified: true }, { witnessName: 'Lakshman', otpVerified: true }, { witnessName: 'Devi S.', otpVerified: true }], syncStatus: 'synced' }),
  createAssessment({ id: 'assess-19', athleteId: 'demo-3', sport: 'Cricket', testType: '60m_sprint', testCategory: 'sai', value: 8.2, unit: 's', percentile: 81, hash: 'cri2...verified', attestations: [{ witnessName: 'Coach Raj', otpVerified: true }, { witnessName: 'Suresh K.', otpVerified: true }, { witnessName: 'Venkat R.', otpVerified: true }], syncStatus: 'synced' }),
  createAssessment({ id: 'assess-20', athleteId: 'demo-5', sport: 'Football', testType: 'vertical_jump', testCategory: 'sai', value: 58, unit: 'cm', percentile: 92, hash: 'foo2...verified', attestations: [{ witnessName: 'Coach Arun', otpVerified: true }, { witnessName: 'Prasad M.', otpVerified: true }, { witnessName: 'Geetha V.', otpVerified: true }], syncStatus: 'synced' }),
];
