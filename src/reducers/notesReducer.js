import { storage } from '../utils/localStorage.js';
import { generateId } from '../utils/helpers.js';

export const initialNotesState = {
  notes: [],
  searchQuery: '',
  filterCategory: 'All',
  sortBy: 'newest',
};

export const notesActions = {
  SET_NOTES: 'SET_NOTES',
  ADD_NOTE: 'ADD_NOTE',
  UPDATE_NOTE: 'UPDATE_NOTE',
  DELETE_NOTE: 'DELETE_NOTE',
  TOGGLE_PIN: 'TOGGLE_PIN',
  TOGGLE_PRIVATE: 'TOGGLE_PRIVATE',
  SET_SEARCH: 'SET_SEARCH',
  SET_FILTER: 'SET_FILTER',
  SET_SORT: 'SET_SORT',
};

const saveNotes = (notes) => {
  storage.set('NOTES', notes);
};

export const notesReducer = (state, action) => {
  switch (action.type) {
    case notesActions.SET_NOTES:
      return { ...state, notes: action.payload };

    case notesActions.ADD_NOTE: {
      const newNote = {
        id: generateId(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPinned: false,
        isPrivate: false,
      };
      const updated = [newNote, ...state.notes];
      saveNotes(updated);
      return { ...state, notes: updated };
    }

    case notesActions.UPDATE_NOTE: {
      const updated = state.notes.map((note) =>
        note.id === action.payload.id
          ? { ...note, ...action.payload.data, updatedAt: new Date().toISOString() }
          : note
      );
      saveNotes(updated);
      return { ...state, notes: updated };
    }

    case notesActions.DELETE_NOTE: {
      const updated = state.notes.filter((note) => note.id !== action.payload);
      saveNotes(updated);
      return { ...state, notes: updated };
    }

    case notesActions.TOGGLE_PIN: {
      const updated = state.notes.map((note) =>
        note.id === action.payload ? { ...note, isPinned: !note.isPinned } : note
      );
      saveNotes(updated);
      return { ...state, notes: updated };
    }

    case notesActions.TOGGLE_PRIVATE: {
      const updated = state.notes.map((note) =>
        note.id === action.payload ? { ...note, isPrivate: !note.isPrivate } : note
      );
      saveNotes(updated);
      return { ...state, notes: updated };
    }

    case notesActions.SET_SEARCH:
      return { ...state, searchQuery: action.payload };

    case notesActions.SET_FILTER:
      return { ...state, filterCategory: action.payload };

    case notesActions.SET_SORT:
      return { ...state, sortBy: action.payload };

    default:
      return state;
  }
};

