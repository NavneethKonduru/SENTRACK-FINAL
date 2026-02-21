/* ========================================
   SENTRAK — Hash Verification (Tamper-proof)
   Owner: Sharvesh (feat/assessment)
   ======================================== */

/**
 * Generate SHA-256 hash for an assessment record.
 * Concatenates: athleteId + testType + value + timestamp + witness phones
 * @param {Object} assessment - Assessment object
 * @returns {Promise<string>} Hex hash string
 */
export async function generateHash(assessment) {
    const witnessPhones = (assessment.attestations || [])
        .map(a => a.witnessPhone || '')
        .sort()
        .join(',');

    const data = [
        assessment.athleteId || '',
        assessment.testType || '',
        String(assessment.value || 0),
        String(assessment.timestamp || Date.now()),
        witnessPhones,
    ].join('|');

    const encoder = new TextEncoder();
    const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    return arrayBufferToHex(buffer);
}

/**
 * Verify that an assessment's hash matches the expected hash.
 * @param {Object} assessment - Assessment object
 * @param {string} expectedHash - The stored hash to compare against
 * @returns {Promise<boolean>}
 */
export async function verifyHash(assessment, expectedHash) {
    const hash = await generateHash(assessment);
    return hash === expectedHash;
}

/**
 * Convert ArrayBuffer to hexadecimal string
 */
function arrayBufferToHex(buffer) {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
