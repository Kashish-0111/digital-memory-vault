import { useState, useRef } from 'react';
import { 
  Moon, 
  Sun, 
  Bell, 
  Volume2, 
  Download, 
  Upload, 
  Trash2, 
  Lock, 
  AlertTriangle,
  Check,
  Database
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { authService } from '../services/auth.js';
import { settingsActions } from '../reducers/settingsReducer.js';
import { downloadJSON, readFileAsText } from '../utils/helpers.js';
import { requestNotificationPermission } from '../services/notifications.js';
import Modal from '../components/common/Modal.jsx';
import GlassCard from '../components/common/GlassCard.jsx';

export default function SettingsPage() {
  const { settings, notes, reminders, categories, clearAllData, loadSampleData } = useApp();
  const { state: settingsState, dispatch: settingsDispatch } = settings;
  const [showPINModal, setShowPINModal] = useState(false);
  const [pinForm, setPinForm] = useState({ current: '', new: '', confirm: '' });
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const fileInputRef = useRef(null);

  const handleToggleTheme = () => {
    settingsDispatch({ type: settingsActions.TOGGLE_THEME });
  };

  const handleToggleNotifications = async () => {
    if (!settingsState.notificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        settingsDispatch({ type: settingsActions.TOGGLE_NOTIFICATIONS });
      }
    } else {
      settingsDispatch({ type: settingsActions.TOGGLE_NOTIFICATIONS });
    }
  };

  const handleToggleSound = () => {
    settingsDispatch({ type: settingsActions.TOGGLE_SOUND });
  };

  const handleChangePIN = async (e) => {
    e.preventDefault();
    setPinError('');
    setPinSuccess('');

    if (pinForm.new !== pinForm.confirm) {
      setPinError('New PINs do not match');
      return;
    }

    if (pinForm.new.length < 4) {
      setPinError('PIN must be at least 4 digits');
      return;
    }

    const result = await authService.changePIN(pinForm.current, pinForm.new);
    if (result.success) {
      setPinSuccess('PIN changed successfully');
      setPinForm({ current: '', new: '', confirm: '' });
      setTimeout(() => setShowPINModal(false), 1500);
    } else {
      setPinError(result.error);
    }
  };

  const handleExport = () => {
    const data = {
      notes: notes.state.notes,
      reminders: reminders.state.reminders,
      categories,
      settings: settingsState,
      exportDate: new Date().toISOString(),
    };
    downloadJSON(data, `memory-vault-backup-${new Date().toISOString().split('T')[0]}.json`);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const content = await readFileAsText(file);
      const data = JSON.parse(content);

      if (data.notes) {
        notes.dispatch({ type: 'SET_NOTES', payload: data.notes });
      }
      if (data.reminders) {
        reminders.dispatch({ type: 'SET_REMINDERS', payload: data.reminders });
      }
      if (data.settings) {
        settingsDispatch({ type: settingsActions.SET_SETTINGS, payload: data.settings });
      }

      alert('Data imported successfully!');
    } catch (error) {
      alert('Failed to import data. Please check the file format.');
    }
    e.target.value = '';
  };

  const handleClearAll = () => {
    clearAllData();
    setShowClearConfirm(false);
  };

  return (
    <div className="page-container max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

      <div className="space-y-6">
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Sun className="w-5 h-5" />
            Appearance
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Light/Dark Mode</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark mode</p>
            </div>
            <button
              onClick={handleToggleTheme}
              className="p-3 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
              {settingsState.theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-primary-600" />
              )}
            </button>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Browser Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about upcoming reminders</p>
              </div>
              <button
                onClick={handleToggleNotifications}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settingsState.notificationsEnabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    settingsState.notificationsEnabled ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Sound Effects</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Play sounds for actions</p>
              </div>
              <button
                onClick={handleToggleSound}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settingsState.soundEnabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    settingsState.soundEnabled ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Security
          </h2>
          <button
            onClick={() => {
              setShowPINModal(true);
              setPinForm({ current: '', new: '', confirm: '' });
              setPinError('');
              setPinSuccess('');
            }}
            className="btn-secondary w-full"
          >
            Change PIN
          </button>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Management
          </h2>
          <div className="space-y-3">
            <button onClick={handleExport} className="btn-secondary w-full flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Export Data (JSON)
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import Data (JSON)
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={() => setShowClearConfirm(true)}
              className="btn-danger w-full flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Data
            </button>
            <button
              onClick={loadSampleData}
              className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
            >
              Load Sample Data
            </button>
          </div>
        </GlassCard>
      </div>

      <Modal isOpen={showPINModal} onClose={() => setShowPINModal(false)} title="Change PIN">
        <form onSubmit={handleChangePIN} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current PIN</label>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={pinForm.current}
              onChange={(e) => setPinForm({ ...pinForm, current: e.target.value })}
              className="input-field"
              placeholder="Enter current PIN"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New PIN</label>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={pinForm.new}
              onChange={(e) => setPinForm({ ...pinForm, new: e.target.value })}
              className="input-field"
              placeholder="Enter new PIN"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New PIN</label>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={pinForm.confirm}
              onChange={(e) => setPinForm({ ...pinForm, confirm: e.target.value })}
              className="input-field"
              placeholder="Confirm new PIN"
            />
          </div>
          {pinError && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              {pinError}
            </p>
          )}
          {pinSuccess && (
            <p className="text-sm text-green-500 flex items-center gap-1">
              <Check className="w-4 h-4" />
              {pinSuccess}
            </p>
          )}
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setShowPINModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Change PIN</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showClearConfirm} onClose={() => setShowClearConfirm(false)} title="Clear All Data">
        <div className="text-center py-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Are you sure?</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            This will permanently delete all your notes, reminders, and categories. This action cannot be undone.
          </p>
          <div className="flex justify-center gap-3">
            <button onClick={() => setShowClearConfirm(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleClearAll} className="btn-danger">Yes, Clear Everything</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
