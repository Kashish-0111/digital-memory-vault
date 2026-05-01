import { storage } from '../utils/localStorage.js';
import { generateId } from '../utils/helpers.js';

export const initialRemindersState = {
  reminders: [],
  filterType: 'All',
  filterStatus: 'upcoming',
  searchQuery: '',
};

export const reminderTypes = [
  'Birthday',
  'Anniversary',
  'Bill Due Date',
  'Meeting',
  'Exam',
  'Goal Deadline',
  'Custom Reminder',
];

export const reminderActions = {
  SET_REMINDERS: 'SET_REMINDERS',
  ADD_REMINDER: 'ADD_REMINDER',
  UPDATE_REMINDER: 'UPDATE_REMINDER',
  DELETE_REMINDER: 'DELETE_REMINDER',
  MARK_NOTIFIED: 'MARK_NOTIFIED',
  SET_FILTER_TYPE: 'SET_FILTER_TYPE',
  SET_FILTER_STATUS: 'SET_FILTER_STATUS',
  SET_SEARCH: 'SET_SEARCH',
};

const saveReminders = (reminders) => {
  storage.set('REMINDERS', reminders);
};

export const remindersReducer = (state, action) => {
  switch (action.type) {
    case reminderActions.SET_REMINDERS:
      return { ...state, reminders: action.payload };

    case reminderActions.ADD_REMINDER: {
      const newReminder = {
        id: generateId(),
        ...action.payload,
        notified: false,
        createdAt: new Date().toISOString(),
      };
      const updated = [...state.reminders, newReminder];
      saveReminders(updated);
      return { ...state, reminders: updated };
    }

    case reminderActions.UPDATE_REMINDER: {
      const updated = state.reminders.map((reminder) =>
        reminder.id === action.payload.id
          ? { ...reminder, ...action.payload.data }
          : reminder
      );
      saveReminders(updated);
      return { ...state, reminders: updated };
    }

    case reminderActions.DELETE_REMINDER: {
      const updated = state.reminders.filter((reminder) => reminder.id !== action.payload);
      saveReminders(updated);
      return { ...state, reminders: updated };
    }

    case reminderActions.MARK_NOTIFIED: {
      const updated = state.reminders.map((reminder) =>
        reminder.id === action.payload ? { ...reminder, notified: true } : reminder
      );
      saveReminders(updated);
      return { ...state, reminders: updated };
    }

    case reminderActions.SET_FILTER_TYPE:
      return { ...state, filterType: action.payload };

    case reminderActions.SET_FILTER_STATUS:
      return { ...state, filterStatus: action.payload };

    case reminderActions.SET_SEARCH:
      return { ...state, searchQuery: action.payload };

    default:
      return state;
  }
};

