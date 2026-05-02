import { useState, useMemo } from 'react';
import { Plus, Search, Calendar, Bell, Repeat, Trash2, Pencil, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { reminderActions, reminderTypes } from '../reducers/remindersReducer.js';
import { formatDate, getDaysUntil, generateId, downloadCSV } from '../utils/helpers.js';
import Modal from '../components/common/Modal.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

export default function RemindersPage() {
  const {
    reminders, categories, settings,
    addReminderFirestore, updateReminderFirestore, deleteReminderFirestore,
    firebaseUser,
  } = useApp();

  const { state: reminderState, dispatch } = reminders;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    type: 'Custom Reminder',
    repeatYearly: false,
    reminderDays: 1,
  });

  const filteredReminders = useMemo(() => {
    let filtered = [...reminderState.reminders];
    if (reminderState.filterType !== 'All') {
      filtered = filtered.filter((r) => r.type === reminderState.filterType);
    }
    if (reminderState.searchQuery) {
      const q = reminderState.searchQuery.toLowerCase();
      filtered = filtered.filter((r) => r.title.toLowerCase().includes(q));
    }
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    return filtered;
  }, [reminderState.reminders, reminderState.filterType, reminderState.searchQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingReminder) {
      dispatch({ type: reminderActions.UPDATE_REMINDER, payload: { id: editingReminder.id, data: formData } });
      if (firebaseUser) {
        await updateReminderFirestore(editingReminder.id, formData);
      }
    } else {
      if (firebaseUser) {
        const firestoreId = await addReminderFirestore(formData);
        dispatch({
          type: reminderActions.ADD_REMINDER,
          payload: { ...formData, firestoreId },
        });
      } else {
        dispatch({ type: reminderActions.ADD_REMINDER, payload: formData });
      }
    }
    closeModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      dispatch({ type: reminderActions.DELETE_REMINDER, payload: id });
      if (firebaseUser) {
        await deleteReminderFirestore(id);
      }
    }
  };

  const openModal = (reminder = null) => {
    if (reminder) {
      setEditingReminder(reminder);
      setFormData({
        title: reminder.title,
        date: reminder.date.split('T')[0],
        type: reminder.type,
        repeatYearly: reminder.repeatYearly,
        reminderDays: reminder.reminderDays,
      });
    } else {
      setEditingReminder(null);
      setFormData({
        title: '',
        date: '',
        type: 'Custom Reminder',
        repeatYearly: false,
        reminderDays: settings.state.defaultReminderDays || 1,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingReminder(null);
  };

  const handleExportCSV = () => {
    if (filteredReminders.length === 0) return;
    const rows = filteredReminders.map((r) => ({
      Title: r.title,
      Date: formatDate(r.date),
      Type: r.type,
      Repeat: r.repeatYearly ? 'Yes' : 'No',
      'Days Before': r.reminderDays,
    }));
    downloadCSV(rows, 'reminders.csv');
  };

  const getDaysLabel = (days) => {
    if (days === 0) return 'Same day';
    if (days === 1) return '1 day before';
    return `${days} days before`;
  };

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reminders</h1>
          {firebaseUser && (
            <p className="text-xs text-green-500 mt-1">● Cloud Synced</p>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="btn-secondary text-sm">Export CSV</button>
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Reminder
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search reminders..."
            value={reminderState.searchQuery}
            onChange={(e) => dispatch({ type: reminderActions.SET_SEARCH, payload: e.target.value })}
            className="input-field pl-10"
          />
        </div>
        <select
          value={reminderState.filterType}
          onChange={(e) => dispatch({ type: reminderActions.SET_FILTER_TYPE, payload: e.target.value })}
          className="input-field w-40"
        >
          <option value="All">All Types</option>
          {reminderTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {filteredReminders.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-16 h-16 text-gray-300" />}
          title="No reminders yet"
          description="Add birthdays, anniversaries, bill due dates, and more."
          action={
            <button onClick={() => openModal()} className="btn-primary">Add First Reminder</button>
          }
        />
      ) : (
        <div className={`grid gap-4 ${settings.state.compactView ? '' : 'lg:grid-cols-2'}`}>
          {filteredReminders.map((reminder) => {
            const daysUntil = getDaysUntil(reminder.date);
            const isToday = daysUntil === 0;
            const isPast = daysUntil !== null && daysUntil < 0;
            const isUpcoming = daysUntil !== null && daysUntil > 0 && daysUntil <= 7;

            return (
              <div key={reminder.id} className="glass-card p-5 group hover:scale-[1.01] transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{reminder.title}</h3>
                      {reminder.repeatYearly && <Repeat className="w-3.5 h-3.5 text-primary-500" />}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {formatDate(reminder.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bell className="w-3.5 h-3.5" /> {getDaysLabel(reminder.reminderDays)}
                      </span>
                    </div>
                    {daysUntil !== null && (
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isToday ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          : isUpcoming ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : isPast ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300'
                        }`}>
                          {isToday ? 'Today' : isPast ? 'Overdue' : `${daysUntil} days left`}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openModal(reminder)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(reminder.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingReminder ? 'Edit Reminder' : 'Add Reminder'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              placeholder="e.g., Mom's Birthday"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input
              required
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="input-field"
            >
              {reminderTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Remind Me</label>
            <select
              value={formData.reminderDays}
              onChange={(e) => setFormData({ ...formData, reminderDays: Number(e.target.value) })}
              className="input-field"
            >
              <option value={0}>Same day</option>
              <option value={1}>1 day before</option>
              <option value={3}>3 days before</option>
              <option value={7}>7 days before</option>
              <option value={14}>14 days before</option>
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.repeatYearly}
              onChange={(e) => setFormData({ ...formData, repeatYearly: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Repeat yearly</span>
          </label>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editingReminder ? 'Update' : 'Add'} Reminder</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
