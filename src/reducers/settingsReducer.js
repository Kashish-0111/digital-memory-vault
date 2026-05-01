import { storage } from '../utils/localStorage.js';

export const initialSettingsState = {
  theme: 'dark',
  notificationsEnabled: true,
  soundEnabled: true,
  defaultReminderDays: 1,
  compactView: false,
};

export const settingsActions = {
  SET_SETTINGS: 'SET_SETTINGS',
  UPDATE_SETTING: 'UPDATE_SETTING',
  TOGGLE_THEME: 'TOGGLE_THEME',
  TOGGLE_NOTIFICATIONS: 'TOGGLE_NOTIFICATIONS',
  TOGGLE_SOUND: 'TOGGLE_SOUND',
  SET_DEFAULT_REMINDER_DAYS: 'SET_DEFAULT_REMINDER_DAYS',
  TOGGLE_COMPACT_VIEW: 'TOGGLE_COMPACT_VIEW',
  RESET_SETTINGS: 'RESET_SETTINGS',
};

const saveSettings = (settings) => {
  storage.set('SETTINGS', settings);
};

export const settingsReducer = (state, action) => {
  switch (action.type) {
    case settingsActions.SET_SETTINGS:
      return { ...state, ...action.payload };

    case settingsActions.UPDATE_SETTING: {
      const updated = { ...state, [action.payload.key]: action.payload.value };
      saveSettings(updated);
      return updated;
    }

    case settingsActions.TOGGLE_THEME: {
      const updated = { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
      saveSettings(updated);
      return updated;
    }

    case settingsActions.TOGGLE_NOTIFICATIONS: {
      const updated = { ...state, notificationsEnabled: !state.notificationsEnabled };
      saveSettings(updated);
      return updated;
    }

    case settingsActions.TOGGLE_SOUND: {
      const updated = { ...state, soundEnabled: !state.soundEnabled };
      saveSettings(updated);
      return updated;
    }

    case settingsActions.SET_DEFAULT_REMINDER_DAYS: {
      const updated = { ...state, defaultReminderDays: action.payload };
      saveSettings(updated);
      return updated;
    }

    case settingsActions.TOGGLE_COMPACT_VIEW: {
      const updated = { ...state, compactView: !state.compactView };
      saveSettings(updated);
      return updated;
    }

    case settingsActions.RESET_SETTINGS:
      saveSettings(initialSettingsState);
      return initialSettingsState;

    default:
      return state;
  }
};

