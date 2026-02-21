/* ========================================
   SENTRAK — Sport-Specific Metrics & SAI Tests
   Owner: Sharvesh (feat/assessment)
   ======================================== */

/**
 * SPORT_METRICS — keyed by sport name.
 * Each sport maps to an array of metric definitions.
 * Each metric: { key, name, nameTamil, unit, inputType, description }
 * inputType: "timer" | "manual" | "count" | "rating"
 */
export const SPORT_METRICS = {
  Cricket: [
    { key: 'bowling_speed', name: 'Bowling Speed', nameTamil: 'பந்து வேகம்', unit: 'km/h', inputType: 'manual', description: 'Speed of delivery measured by radar/estimate' },
    { key: 'batting_distance', name: 'Batting Distance', nameTamil: 'அடிக்கும் தூரம்', unit: 'm', inputType: 'manual', description: 'Longest hit distance in a session' },
    { key: 'fielding_reaction', name: 'Fielding Reaction', nameTamil: 'கள நடவடிக்கை', unit: 's', inputType: 'timer', description: 'Reaction time to catch/field a ball' },
  ],
  Football: [
    { key: 'sprint_40m', name: '40m Sprint', nameTamil: '40மீ ஓட்டம்', unit: 's', inputType: 'timer', description: 'Time to sprint 40 meters' },
    { key: 'endurance_beep_level', name: 'Beep Test Level', nameTamil: 'சகிப்பு நிலை', unit: 'level', inputType: 'manual', description: 'Endurance beep test level reached (1-20)' },
    { key: 'passing_accuracy', name: 'Passing Accuracy', nameTamil: 'பாஸ் துல்லியம்', unit: '/10', inputType: 'count', description: 'Successful passes out of 10 attempts' },
    { key: 'dribble_time', name: 'Dribble Time', nameTamil: 'டிரிபிள் நேரம்', unit: 's', inputType: 'timer', description: 'Time to complete dribble course' },
  ],
  Kabaddi: [
    { key: 'raid_success_rate', name: 'Raid Success Rate', nameTamil: 'ரெய்டு வெற்றி', unit: '%', inputType: 'manual', description: 'Percentage of successful raids' },
    { key: 'tackle_count', name: 'Tackle Count', nameTamil: 'தடுப்பு எண்ணிக்கை', unit: 'count', inputType: 'count', description: 'Number of successful tackles in a session' },
    { key: 'flexibility', name: 'Flexibility', nameTamil: 'நெகிழ்வுத்தன்மை', unit: 'cm', inputType: 'manual', description: 'Sit-and-reach flexibility measurement' },
  ],
  Hockey: [
    { key: 'sprint_30m', name: '30m Sprint', nameTamil: '30மீ ஓட்டம்', unit: 's', inputType: 'timer', description: 'Time to sprint 30 meters' },
    { key: 'dribble_slalom', name: 'Dribble Slalom', nameTamil: 'டிரிபிள் சிலாலம்', unit: 's', inputType: 'timer', description: 'Time to complete slalom dribble course' },
    { key: 'shot_accuracy', name: 'Shot Accuracy', nameTamil: 'ஷாட் துல்லியம்', unit: '/10', inputType: 'count', description: 'Goals scored out of 10 attempts' },
    { key: 'endurance_beep', name: 'Beep Test', nameTamil: 'பீப் சோதனை', unit: 'level', inputType: 'manual', description: 'Endurance beep test level reached' },
  ],
  Badminton: [
    { key: 'shuttle_run', name: 'Shuttle Run', nameTamil: 'ஷட்டில் ஓட்டம்', unit: 's', inputType: 'timer', description: 'Time to complete shuttle run course' },
    { key: 'reaction_time', name: 'Reaction Time', nameTamil: 'எதிர்வினை நேரம்', unit: 's', inputType: 'timer', description: 'Light-based reaction time test' },
    { key: 'smash_count_60s', name: 'Smash Count (60s)', nameTamil: 'ஸ்மாஷ் எண்ணிக்கை', unit: 'count', inputType: 'count', description: 'Number of smashes in 60 seconds' },
    { key: 'footwork_test', name: 'Footwork Test', nameTamil: 'கால் வேலை சோதனை', unit: 's', inputType: 'timer', description: 'Time to complete 6-point footwork drill' },
  ],
  Wrestling: [
    { key: 'pushups_60s', name: 'Push-ups (60s)', nameTamil: 'புஷ்-அப் (60வி)', unit: 'count', inputType: 'count', description: 'Number of push-ups in 60 seconds' },
    { key: 'situps_60s', name: 'Sit-ups (60s)', nameTamil: 'சிட்-அப் (60வி)', unit: 'count', inputType: 'count', description: 'Number of sit-ups in 60 seconds' },
    { key: 'flexibility', name: 'Flexibility', nameTamil: 'நெகிழ்வுத்தன்மை', unit: 'cm', inputType: 'manual', description: 'Sit-and-reach flexibility measurement' },
    { key: 'weight', name: 'Body Weight', nameTamil: 'உடல் எடை', unit: 'kg', inputType: 'manual', description: 'Athlete body weight' },
  ],
  Athletics_Track: [
    { key: '100m', name: '100m Sprint', nameTamil: '100மீ ஓட்டம்', unit: 's', inputType: 'timer', description: '100 meter sprint time' },
    { key: '200m', name: '200m Sprint', nameTamil: '200மீ ஓட்டம்', unit: 's', inputType: 'timer', description: '200 meter sprint time' },
    { key: '400m', name: '400m Run', nameTamil: '400மீ ஓட்டம்', unit: 's', inputType: 'timer', description: '400 meter run time' },
    { key: '800m', name: '800m Run', nameTamil: '800மீ ஓட்டம்', unit: 's', inputType: 'timer', description: '800 meter run time' },
    { key: '1500m', name: '1500m Run', nameTamil: '1500மீ ஓட்டம்', unit: 's', inputType: 'timer', description: '1500 meter run time' },
  ],
  Athletics_Field: [
    { key: 'long_jump', name: 'Long Jump', nameTamil: 'நீளம் தாண்டுதல்', unit: 'm', inputType: 'manual', description: 'Longest jump distance' },
    { key: 'high_jump', name: 'High Jump', nameTamil: 'உயரம் தாண்டுதல்', unit: 'm', inputType: 'manual', description: 'Highest successful jump' },
    { key: 'shot_put', name: 'Shot Put', nameTamil: 'குண்டு எறிதல்', unit: 'm', inputType: 'manual', description: 'Shot put throw distance' },
    { key: 'discus', name: 'Discus Throw', nameTamil: 'வட்டு எறிதல்', unit: 'm', inputType: 'manual', description: 'Discus throw distance' },
    { key: 'javelin', name: 'Javelin Throw', nameTamil: 'ஈட்டி எறிதல்', unit: 'm', inputType: 'manual', description: 'Javelin throw distance' },
  ],
  Swimming: [
    { key: '50m_freestyle', name: '50m Freestyle', nameTamil: '50மீ ஃப்ரீஸ்டைல்', unit: 's', inputType: 'timer', description: '50 meter freestyle swim time' },
    { key: '100m_freestyle', name: '100m Freestyle', nameTamil: '100மீ ஃப்ரீஸ்டைல்', unit: 's', inputType: 'timer', description: '100 meter freestyle swim time' },
    { key: 'technique_score', name: 'Technique Score', nameTamil: 'நுட்ப மதிப்பெண்', unit: '/5', inputType: 'rating', description: 'Coach-rated technique score (1-5)' },
  ],
  Boxing: [
    { key: 'punch_count_30s', name: 'Punch Count (30s)', nameTamil: 'குத்து எண்ணிக்கை', unit: 'count', inputType: 'count', description: 'Number of punches in 30 seconds' },
    { key: 'reaction_test', name: 'Reaction Test', nameTamil: 'எதிர்வினை சோதனை', unit: 's', inputType: 'timer', description: 'Visual stimulus reaction time' },
    { key: 'endurance_3min', name: 'Endurance (3 min)', nameTamil: 'சகிப்பு (3 நிமிடம்)', unit: '/5', inputType: 'rating', description: 'Rated endurance over 3-minute round (1-5)' },
    { key: 'weight', name: 'Body Weight', nameTamil: 'உடல் எடை', unit: 'kg', inputType: 'manual', description: 'Athlete body weight' },
  ],
  Archery: [
    { key: 'score_10m', name: 'Score at 10m', nameTamil: '10மீ மதிப்பெண்', unit: '/300', inputType: 'manual', description: 'Total score at 10 meters (0-300)' },
    { key: 'score_20m', name: 'Score at 20m', nameTamil: '20மீ மதிப்பெண்', unit: '/300', inputType: 'manual', description: 'Total score at 20 meters (0-300)' },
    { key: 'score_30m', name: 'Score at 30m', nameTamil: '30மீ மதிப்பெண்', unit: '/300', inputType: 'manual', description: 'Total score at 30 meters (0-300)' },
  ],
  Weightlifting: [
    { key: 'snatch_max', name: 'Snatch Max', nameTamil: 'ஸ்நாட்ச் அதிகபட்சம்', unit: 'kg', inputType: 'manual', description: 'Maximum snatch lift weight' },
    { key: 'clean_jerk_max', name: 'Clean & Jerk Max', nameTamil: 'க்ளீன் & ஜெர்க் அதிகபட்சம்', unit: 'kg', inputType: 'manual', description: 'Maximum clean & jerk lift weight' },
    { key: 'body_weight', name: 'Body Weight', nameTamil: 'உடல் எடை', unit: 'kg', inputType: 'manual', description: 'Athlete body weight' },
  ],
};

/**
 * SAI_TESTS — the 8 standard SAI (Sports Authority of India) battery tests
 */
export const SAI_TESTS = [
  { key: '30m_sprint', name: '30m Sprint', nameTamil: '30மீ ஓட்டம்', unit: 's', inputType: 'timer', description: 'Sprint 30 meters as fast as possible. Stand behind the starting line. On "Go", sprint to the finish line.', icon: '🏃' },
  { key: '60m_sprint', name: '60m Sprint', nameTamil: '60மீ ஓட்டம்', unit: 's', inputType: 'timer', description: 'Sprint 60 meters at full speed. Stand behind the starting line. On "Go", sprint through the finish line.', icon: '🏃‍♂️' },
  { key: '600m_run', name: '600m Run', nameTamil: '600மீ ஓட்டம்', unit: 's', inputType: 'timer', description: 'Run 600 meters (1.5 laps of a standard track). Pace yourself for endurance.', icon: '🏃‍♀️' },
  { key: 'standing_broad_jump', name: 'Standing Broad Jump', nameTamil: 'நிலை நீளம் தாண்டுதல்', unit: 'm', inputType: 'manual', description: 'Stand with toes behind the line. Jump forward as far as possible. Measure from the line to the nearest contact point.', icon: '🦘' },
  { key: 'vertical_jump', name: 'Vertical Jump', nameTamil: 'செங்குத்து தாவல்', unit: 'cm', inputType: 'manual', description: 'Stand next to a wall and reach up — mark the height. Jump as high as possible and mark again. Measure the difference.', icon: '⬆️' },
  { key: 'shuttle_run_4x10m', name: 'Shuttle Run (4×10m)', nameTamil: 'ஷட்டில் ஓட்டம் (4x10மீ)', unit: 's', inputType: 'timer', description: 'Run between 2 lines 10m apart, 4 times (total 40m). Pick up and place blocks at each end.', icon: '🔄' },
  { key: 'flexibility_sit_reach', name: 'Sit & Reach', nameTamil: 'உட்கார்ந்து நீட்டு', unit: 'cm', inputType: 'manual', description: 'Sit with legs straight. Reach forward as far as possible along the ruler. Record the furthest reach in cm.', icon: '🧘' },
  { key: 'bmi', name: 'BMI', nameTamil: 'உடல் நிறை குறியீடு', unit: 'kg/m²', inputType: 'calculated', description: 'Body Mass Index = weight (kg) / height (m)². Enter height and weight to auto-calculate.', icon: '⚖️' },
];

/**
 * Sport emoji map for UI display
 */
export const SPORT_ICONS = {
  Cricket: '🏏',
  Football: '⚽',
  Kabaddi: '🤼',
  Hockey: '🏑',
  Badminton: '🏸',
  Wrestling: '🤼‍♂️',
  Athletics_Track: '🏃',
  Athletics_Field: '🥏',
  Swimming: '🏊',
  Boxing: '🥊',
  Archery: '🏹',
  Weightlifting: '🏋️',
};
