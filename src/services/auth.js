import { hashPIN, verifyPIN } from '../utils/helpers.js';

const AUTH_KEY = 'dmv_auth';

export const authService = {
  async initializePIN(pin) {
    const hashed = await hashPIN(pin);
    const authData = {
      hashedPin: hashed,
      isAuthenticated: false,
      lastLogin: null,
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    return authData;
  },

  async login(pin) {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return { success: false, error: 'No PIN set up. Please create a PIN first.' };

    const authData = JSON.parse(stored);
    const isValid = await verifyPIN(pin, authData.hashedPin);

    if (isValid) {
      authData.isAuthenticated = true;
      authData.lastLogin = new Date().toISOString();
      localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
      return { success: true, data: authData };
    }

    return { success: false, error: 'Incorrect PIN. Please try again.' };
  },

  logout() {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      const authData = JSON.parse(stored);
      authData.isAuthenticated = false;
      localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    }
  },

  isAuthenticated() {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return false;
    const authData = JSON.parse(stored);
    return authData.isAuthenticated === true;
  },

  hasPIN() {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return false;
    const authData = JSON.parse(stored);
    return !!authData.hashedPin;
  },

  async changePIN(currentPin, newPin) {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return { success: false, error: 'No PIN found.' };

    const authData = JSON.parse(stored);
    const isValid = await verifyPIN(currentPin, authData.hashedPin);

    if (!isValid) {
      return { success: false, error: 'Current PIN is incorrect.' };
    }

    const newHashed = await hashPIN(newPin);
    authData.hashedPin = newHashed;
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    return { success: true };
  },

  getAuthData() {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  },
};

