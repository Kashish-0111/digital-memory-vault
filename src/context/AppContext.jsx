import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { authService } from '../services/auth.js';
import { storage } from '../utils/localStorage.js';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config.js';
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, query, where, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { authReducer, initialAuthState, authActions } from '../reducers/authReducer.js';
import { notesReducer, initialNotesState, notesActions } from '../reducers/notesReducer.js';
import { remindersReducer, initialRemindersState, reminderActions } from '../reducers/remindersReducer.js';
import { settingsReducer, initialSettingsState, settingsActions } from '../reducers/settingsReducer.js';
import { getDefaultCategories, getSampleNotes, getSampleReminders } from '../utils/sampleData.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [authState, authDispatch] = useReducer(authReducer, initialAuthState);
  const [notesState, notesDispatch] = useReducer(notesReducer, initialNotesState);
  const [remindersState, remindersDispatch] = useReducer(remindersReducer, initialRemindersState);
  const [settingsState, settingsDispatch] = useReducer(settingsReducer, initialSettingsState);
  const [categories, setCategories] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null);

  // Firebase auth state listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        // Firebase user logged in — load their Firestore data
        loadFirestoreData(user.uid);
      }
    });
    return unsub;
  }, []);

  // Local PIN auth + localStorage init
  useEffect(() => {
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

  // ── Firestore Load ──
  const loadFirestoreData = async (uid) => {
    try {
      // Notes
      const notesSnap = await getDocs(query(collection(db, 'notes'), where('userId', '==', uid)));
      const firestoreNotes = notesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (firestoreNotes.length > 0) {
        notesDispatch({ type: notesActions.SET_NOTES, payload: firestoreNotes });
        storage.set('NOTES', firestoreNotes);
      }

      // Reminders
      const remSnap = await getDocs(query(collection(db, 'reminders'), where('userId', '==', uid)));
      const firestoreReminders = remSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (firestoreReminders.length > 0) {
        remindersDispatch({ type: reminderActions.SET_REMINDERS, payload: firestoreReminders });
        storage.set('REMINDERS', firestoreReminders);
      }

      // Categories
      const catSnap = await getDocs(query(collection(db, 'categories'), where('userId', '==', uid)));
      const firestoreCategories = catSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (firestoreCategories.length > 0) {
        setCategories(firestoreCategories);
        storage.set('CATEGORIES', firestoreCategories);
      }
    } catch (err) {
      console.error('Firestore load error:', err);
    }
  };

  // ── Notes (Firestore + Local) ──
  const addNoteFirestore = async (note) => {
    if (!firebaseUser) return null;
    const docRef = await addDoc(collection(db, 'notes'), {
      ...note,
      userId: firebaseUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  };

  const updateNoteFirestore = async (noteId, data) => {
    if (!firebaseUser) return;
    await updateDoc(doc(db, 'notes', noteId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  };

  const deleteNoteFirestore = async (noteId) => {
    if (!firebaseUser) return;
    await deleteDoc(doc(db, 'notes', noteId));
  };

  // ── Reminders (Firestore + Local) ──
  const addReminderFirestore = async (reminder) => {
    if (!firebaseUser) return null;
    const docRef = await addDoc(collection(db, 'reminders'), {
      ...reminder,
      userId: firebaseUser.uid,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  };

  const updateReminderFirestore = async (reminderId, data) => {
    if (!firebaseUser) return;
    await updateDoc(doc(db, 'reminders', reminderId), data);
  };

  const deleteReminderFirestore = async (reminderId) => {
    if (!firebaseUser) return;
    await deleteDoc(doc(db, 'reminders', reminderId));
  };

  // ── Categories ──
  const addCategory = async (category) => {
    const updated = [...categories, category];
    setCategories(updated);
    storage.set('CATEGORIES', updated);
    if (firebaseUser) {
      await addDoc(collection(db, 'categories'), {
        ...category,
        userId: firebaseUser.uid,
      });
    }
  };

  const updateCategory = async (id, data) => {
    const updated = categories.map((cat) => (cat.id === id ? { ...cat, ...data } : cat));
    setCategories(updated);
    storage.set('CATEGORIES', updated);
    if (firebaseUser) {
      await updateDoc(doc(db, 'categories', id), data);
    }
  };

  const deleteCategory = async (id) => {
    const updated = categories.filter((cat) => cat.id !== id);
    setCategories(updated);
    storage.set('CATEGORIES', updated);
    if (firebaseUser) {
      await deleteDoc(doc(db, 'categories', id));
    }
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
    firebaseUser,
    // Firestore functions
    addNoteFirestore,
    updateNoteFirestore,
    deleteNoteFirestore,
    addReminderFirestore,
    updateReminderFirestore,
    deleteReminderFirestore,
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