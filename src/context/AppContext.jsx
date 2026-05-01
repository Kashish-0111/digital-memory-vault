import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { authService } from '../services/auth.js';
import { storage } from '../utils/localStorage.js';
import {
  authReducer,
  initialAuthState,
  authActions,
} from '../reducers/authReducer.js';
import {
  notesReducer,
  initialNotesState,
  notesActions,
} from '../reducers/notesReducer.js';
import {
  remindersReducer,
  initialRemindersState,
  reminderActions,
} from '../reducers/remindersReducer.js';
import {
  settingsReducer,
  initialSettingsState,
  settingsActions,
} from '../reducers/settingsReducer.js';
import {
  getDefaultCategories,
  getSampleNotes,
  getSampleReminders,
} from '../utils/sampleData.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [authState, authDispatch] = useReducer(authReducer, initialAuthState);
  const [notesState, notesDispatch] = useReducer(notesReducer, initialNotesState);
  const [remindersState, remindersDispatch] = useReducer(remindersReducer, initialRemindersState);
  const [settingsState, settingsDispatch] = useReducer(settingsReducer, initialSettingsState);
  const [categories, setCategories] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const authData = authService.getAuthData();
    authDispatch({
      type: authActions.SET_AUTH_STATE,
      payload: {
        isAuthenticated: authService.isAuthenticated(),
        hasPIN: authService.hasPIN(),
      },
    });

    const storedNotes = storage.get('NOTES', []);
    notesDispatch({ type: notesActions.SET_NOTES, payload: storedNotes });

    const storedReminders = storage.get('REMINDERS', []);
    remindersDispatch({ type: reminderActions.SET_REMINDERS, payload: storedReminders });

    const storedSettings = storage.get('SETTINGS', initialSettingsState);
    settingsDispatch({ type: settingsActions.SET_SETTINGS, payload: storedSettings });

    const storedCategories = storage.get('CATEGORIES', []);
    if (storedCategories.length > 0) {
      setCategories(storedCategories);
    } else {
      const defaults = getDefaultCategories();
      setCategories(defaults);
      storage.set('CATEGORIES', defaults);
    }

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (settingsState.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settingsState.theme]);

  const addCategory = (category) => {
    const updated = [...categories, category];
    setCategories(updated);
    storage.set('CATEGORIES', updated);
  };

  const updateCategory = (id, data) => {
    const updated = categories.map((cat) => (cat.id === id ? { ...cat, ...data } : cat));
    setCategories(updated);
    storage.set('CATEGORIES', updated);
  };

  const deleteCategory = (id) => {
    const updated = categories.filter((cat) => cat.id !== id);
    setCategories(updated);
    storage.set('CATEGORIES', updated);
  };

  const loadSampleData = () => {
    const sampleNotes = getSampleNotes();
    const sampleReminders = getSampleReminders();
    notesDispatch({ type: notesActions.SET_NOTES, payload: sampleNotes });
    remindersDispatch({ type: reminderActions.SET_REMINDERS, payload: sampleReminders });
    storage.set('NOTES', sampleNotes);
    storage.set('REMINDERS', sampleReminders);
  };

  const clearAllData = () => {
    notesDispatch({ type: notesActions.SET_NOTES, payload: [] });
    remindersDispatch({ type: reminderActions.SET_REMINDERS, payload: [] });
    const defaults = getDefaultCategories();
    setCategories(defaults);
    storage.set('NOTES', []);
    storage.set('REMINDERS', []);
    storage.set('CATEGORIES', defaults);
  };

  const value = {
    auth: { state: authState, dispatch: authDispatch },
    notes: { state: notesState, dispatch: notesDispatch },
    reminders: { state: remindersState, dispatch: remindersDispatch },
    settings: { state: settingsState, dispatch: settingsDispatch },
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    loadSampleData,
    clearAllData,
    isInitialized,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

