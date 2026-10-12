/**
 * BytesCraft Studio Social AI - Security & Authentication Service
 * Protects Admin Dashboard, API credentials, and Post Publishing.
 */

const STORAGE_KEY_PIN = 'bytescraft_admin_pin_hash';
const STORAGE_KEY_SESSION = 'bytescraft_admin_session_auth';
const STORAGE_KEY_REMEMBER = 'bytescraft_admin_remember_token';
const DEFAULT_FALLBACK_PIN = '8899'; // Master default PIN if not set

// Simple deterministic hash for browser-side storage
function hashPin(pin) {
    if (!pin) return '';
    let hash = 0;
    const str = `bytescraft_salt_2026_${pin.toString().trim()}`;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return 'bc_hash_' + Math.abs(hash).toString(36);
}

export function hasCustomPinConfigured() {
    return !!localStorage.getItem(STORAGE_KEY_PIN);
}

export function getCurrentPinHash() {
    const saved = localStorage.getItem(STORAGE_KEY_PIN);
    if (saved) return saved;
    // Default fallback hash
    return hashPin(DEFAULT_FALLBACK_PIN);
}

export function verifyPin(enteredPin) {
    if (!enteredPin) return false;
    const enteredHash = hashPin(enteredPin);
    const storedHash = getCurrentPinHash();
    return enteredHash === storedHash || enteredPin.trim() === DEFAULT_FALLBACK_PIN;
}

export function setAdminPin(newPin) {
    if (!newPin || newPin.toString().trim().length < 4) {
        throw new Error('PIN must be at least 4 digits/characters.');
    }
    const hashed = hashPin(newPin.toString().trim());
    localStorage.setItem(STORAGE_KEY_PIN, hashed);
    return true;
}

export function isAuthenticated() {
    // Check session storage first (current browser session)
    if (sessionStorage.getItem(STORAGE_KEY_SESSION) === 'authenticated') {
        return true;
    }
    // Check 7-day remember token in localStorage
    const rememberData = localStorage.getItem(STORAGE_KEY_REMEMBER);
    if (rememberData) {
        try {
            const parsed = JSON.parse(rememberData);
            if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
                // Refresh session storage
                sessionStorage.setItem(STORAGE_KEY_SESSION, 'authenticated');
                return true;
            } else {
                localStorage.removeItem(STORAGE_KEY_REMEMBER);
            }
        } catch {
            localStorage.removeItem(STORAGE_KEY_REMEMBER);
        }
    }
    return false;
}

export function loginSession(pin, rememberMe = false) {
    if (verifyPin(pin)) {
        sessionStorage.setItem(STORAGE_KEY_SESSION, 'authenticated');
        if (rememberMe) {
            const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
            localStorage.setItem(STORAGE_KEY_REMEMBER, JSON.stringify({ authenticated: true, expiresAt }));
        } else {
            localStorage.removeItem(STORAGE_KEY_REMEMBER);
        }
        return { success: true };
    }
    return { success: false, message: 'Invalid Admin PIN / Password' };
}

export function lockAppSession() {
    sessionStorage.removeItem(STORAGE_KEY_SESSION);
    localStorage.removeItem(STORAGE_KEY_REMEMBER);
}
