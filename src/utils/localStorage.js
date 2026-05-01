const STORAGE_KEYS = {
  AUTH: 'dmv_auth',
  NOTES: 'dmv_notes',
  REMINDERS: 'dmv_reminders',
  CATEGORIES: 'dmv_categories',
  SETTINGS: 'dmv_settings',
};

export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(STORAGE_KEYS[key] || key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(STORAGE_KEYS[key] || key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(STORAGE_KEYS[key] || key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  exportAll: () => {
    const data = {};
    Object.values(STORAGE_KEYS).forEach((storageKey) => {
      const item = localStorage.getItem(storageKey);
      if (item) {
        data[storageKey] = JSON.parse(item);
      }
    });
    return JSON.stringify(data, null, 2);
  },

  importAll: (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },
};

export const KEYS = STORAGE_KEYS;

