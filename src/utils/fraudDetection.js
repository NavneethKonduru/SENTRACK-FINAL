/* ========================================
   SENTRAK — Fraud Detection & Anomaly Checks
   Owner: Sharvesh (feat/assessment)
   ======================================== */

/**
 * Known performance ranges for anomaly detection
 * Format: { [testType]: { min, max, mean, stdDev } }
 * Based on average grassroots athlete data for U-14/U-16
 */
const PERFORMANCE_RANGES = {
    // SAI Tests
    '30m_sprint': { min: 3.5, max: 8.0, mean: 5.0, stdDev: 0.5 },
    '60m_sprint': { min: 7.0, max: 14.0, mean: 9.2, stdDev: 0.8 },
    '600m_run': { min: 90, max: 240, mean: 150, stdDev: 20 },
    'standing_broad_jump': { min: 1.0, max: 3.5, mean: 2.0, stdDev: 0.3 },
    'vertical_jump': { min: 15, max: 75, mean: 40, stdDev: 8 },
    'shuttle_run_4x10m': { min: 8.0, max: 18.0, mean: 12.0, stdDev: 1.2 },
    'flexibility_sit_reach': { min: -5, max: 45, mean: 20, stdDev: 7 },
    'bmi': { min: 12, max: 35, mean: 20, stdDev: 3 },
    // Sport-specific
    'bowling_speed': { min: 40, max: 160, mean: 90, stdDev: 15 },
    'batting_distance': { min: 5, max: 120, mean: 40, stdDev: 15 },
    'fielding_reaction': { min: 0.15, max: 3.0, mean: 0.8, stdDev: 0.2 },
    'sprint_40m': { min: 4.5, max: 9.0, mean: 6.0, stdDev: 0.6 },
    '100m': { min: 9.5, max: 20.0, mean: 13.5, stdDev: 1.2 },
    '200m': { min: 20.0, max: 40.0, mean: 28.0, stdDev: 2.5 },
    '400m': { min: 45.0, max: 100.0, mean: 65.0, stdDev: 6 },
    '800m': { min: 100, max: 240, mean: 160, stdDev: 15 },
    '1500m': { min: 210, max: 480, mean: 330, stdDev: 30 },
    'long_jump': { min: 1.5, max: 8.0, mean: 4.0, stdDev: 0.8 },
    'high_jump': { min: 0.8, max: 2.3, mean: 1.4, stdDev: 0.2 },
    'shot_put': { min: 3, max: 22, mean: 10, stdDev: 3 },
    'discus': { min: 8, max: 65, mean: 25, stdDev: 8 },
    'javelin': { min: 10, max: 85, mean: 35, stdDev: 10 },
    'punch_count_30s': { min: 10, max: 120, mean: 50, stdDev: 15 },
    'pushups_60s': { min: 5, max: 80, mean: 35, stdDev: 10 },
    'situps_60s': { min: 5, max: 70, mean: 30, stdDev: 8 },
};

/**
 * Physically impossible thresholds — absolute limits
 * If a value is better than these, it's physically impossible for grassroots youth
 */
const IMPOSSIBLE_THRESHOLDS = {
    '100m': 9.5,       // World record level — impossible for U-14
    '200m': 19.0,
    '400m': 43.0,
    '30m_sprint': 3.0,
    '60m_sprint': 6.5,
    '600m_run': 80,
    'long_jump': 8.5,
    'high_jump': 2.4,
    'bowling_speed': 165,
    'sprint_40m': 4.0,
};

/**
 * Check assessment for anomalies
 * @param {Object} assessment - Assessment object with testType, value
 * @param {string} sport - Sport name
 * @returns {{ isAnomaly: boolean, flags: string[], severity: 'low'|'medium'|'high' }}
 */
export function checkAnomalies(assessment, sport) {
    const flags = [];
    let severity = 'low';
    const { testType, value } = assessment;

    // 1. Physically impossible check
    const impossibleLimit = IMPOSSIBLE_THRESHOLDS[testType];
    if (impossibleLimit !== undefined) {
        // For time-based events, lower is faster (better)
        const isTimeBased = ['s'].includes(assessment.unit);
        if (isTimeBased && value < impossibleLimit) {
            flags.push(`Physically impossible: ${value}${assessment.unit} is below world-record level (${impossibleLimit}${assessment.unit})`);
            severity = 'high';
        }
        // For distance/speed, higher is better
        if (!isTimeBased && value > impossibleLimit) {
            flags.push(`Physically impossible: ${value}${assessment.unit} exceeds known limits (${impossibleLimit}${assessment.unit})`);
            severity = 'high';
        }
    }

    // 2. Statistical outlier detection (> 3 std devs from mean)
    const range = PERFORMANCE_RANGES[testType];
    if (range) {
        const zScore = Math.abs((value - range.mean) / range.stdDev);
        if (zScore > 3) {
            flags.push(`Statistical outlier: ${value} is ${zScore.toFixed(1)} std deviations from mean (${range.mean})`);
            if (severity !== 'high') severity = 'medium';
        } else if (zScore > 2.5) {
            flags.push(`Unusual value: ${value} is ${zScore.toFixed(1)} std deviations from expected range`);
            if (severity === 'low') severity = 'low';
        }

        // Out of valid range
        if (value < range.min || value > range.max) {
            flags.push(`Out of expected range: ${value} not in [${range.min}, ${range.max}]`);
            if (severity !== 'high') severity = 'medium';
        }
    }

    // 3. Negative or zero value check
    if (value <= 0 && testType !== 'flexibility_sit_reach') {
        flags.push('Invalid: value is zero or negative');
        severity = 'high';
    }

    return {
        isAnomaly: flags.length > 0,
        flags,
        severity,
    };
}

/**
 * Check attestor reputation
 * @param {string} phone - Witness phone number
 * @param {Array} allAttestations - All attestations in the system
 * @returns {{ trustScore: number, flag: string|null }}
 */
export function checkAttestorReputation(phone, allAttestations = []) {
    const now = Date.now();
    const last24h = now - (24 * 60 * 60 * 1000);

    // Count attestations by this phone in last 24 hours
    const recentCount = allAttestations.filter(a =>
        a.witnessPhone === phone && a.timestamp > last24h
    ).length;

    let trustScore = 100;
    let flag = null;

    if (recentCount > 20) {
        trustScore = Math.max(0, 100 - (recentCount - 20) * 5);
        flag = `Suspicious: This phone has verified ${recentCount} assessments in the last 24 hours (limit: 20)`;
    } else if (recentCount > 10) {
        trustScore = 80;
        flag = `Note: This phone has verified ${recentCount} assessments recently`;
    }

    return { trustScore, flag };
}
