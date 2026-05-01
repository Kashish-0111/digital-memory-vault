import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config.js';

// ── NOTES ──
export const getNotes = async (userId) => {
  const q = query(
    collection(db, 'notes'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addNote = (userId, note) =>
  addDoc(collection(db, 'notes'), {
    ...note,
    userId,
    createdAt: serverTimestamp()
  });

export const updateNote = (noteId, data) =>
  updateDoc(doc(db, 'notes', noteId), data);

export const deleteNote = (noteId) =>
  deleteDoc(doc(db, 'notes', noteId));

// ── REMINDERS ──
export const getReminders = async (userId) => {
  const q = query(
    collection(db, 'reminders'),
    where('userId', '==', userId),
    orderBy('date', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addReminder = (userId, reminder) =>
  addDoc(collection(db, 'reminders'), {
    ...reminder,
    userId,
    createdAt: serverTimestamp()
  });

export const updateReminder = (reminderId, data) =>
  updateDoc(doc(db, 'reminders', reminderId), data);

export const deleteReminder = (reminderId) =>
  deleteDoc(doc(db, 'reminders', reminderId));

// ── CATEGORIES ──
export const getCategories = async (userId) => {
  const q = query(
    collection(db, 'categories'),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addCategory = (userId, category) =>
  addDoc(collection(db, 'categories'), {
    ...category,
    userId,
    createdAt: serverTimestamp()
  });

export const updateCategory = (categoryId, data) =>
  updateDoc(doc(db, 'categories', categoryId), data);

export const deleteCategory = (categoryId) =>
  deleteDoc(doc(db, 'categories', categoryId));