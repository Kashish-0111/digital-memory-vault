import { useEffect, useMemo } from 'react';
import {
  FileText,
  Bell,
  Cake,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Clock,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
import {
  getTodayReminders,
  getUpcomingReminders,
  getBirthdaysThisMonth,
} from '../services/notifications.js';
import { isOverdue, getDaysUntil } from '../utils/helpers.js';
import StatCard from '../components/common/StatCard.jsx';
import GlassCard from '../components/common/GlassCard.jsx';
import ConfettiEffect from '../components/common/ConfettiEffect.jsx';

export default function DashboardPage() {
  const { notes, reminders, categories } = useApp();
  const navigate = useNavigate();

  const todayReminders = useMemo(
    () => getTodayReminders(reminders.state.reminders),
    [reminders.state.reminders]
  );

  const upcoming = useMemo(
    () => getUpcomingReminders(reminders.state.reminders, 30),
    [reminders.state.reminders]
  );

  const birthdaysThisMonth = useMemo(
    () => getBirthdaysThisMonth(reminders.state.reminders),
    [reminders.state.reminders]
  );

  const billsDue = useMemo(
    () =>
      reminders.state.reminders.filter(
        (r) => r.type === 'Bill Due Date' && !isOverdue(r.date)
      ),
    [reminders.state.reminders]
  );

  const overdueReminders = useMemo(
    () => reminders.state.reminders.filter((r) => isOverdue(r.date)),
    [reminders.state.reminders]
  );

  const recentNotes = useMemo(
    () => notes.state.notes.slice(0, 5),
    [notes.state.notes]
  );

  const hasBirthdayToday = todayReminders.some((r) => r.type === 'Birthday');

  return (
    <div className="page-container space-y-6">
      <ConfettiEffect active={hasBirthdayToday} />

      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Your personal vault at a glance
          </p>
        </div>
        <button
          onClick={() => navigate('/notes')}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus className="w-5 h-5" />
          Quick Add
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Notes"
          value={notes.state.notes.length}
          icon={<FileText className="w-6 h-6" />}
          trend={notes.state.notes.length > 0 ? '+ New' : 'Start adding'}
          trendUp={true}
          color="blue"
        />
        <StatCard
          title="Upcoming Reminders"
          value={upcoming.length}
          icon={<Bell className="w-6 h-6" />}
          trend={upcoming.length > 0 ? `${upcoming.length} active` : 'None'}
          trendUp={upcoming.length > 0}
          color="purple"
        />
        <StatCard
          title="Birthdays This Month"
          value={birthdaysThisMonth.length}
          icon={<Cake className="w-6 h-6" />}
          trend={birthdaysThisMonth.length > 0 ? 'Celebrate!' : 'None'}
          trendUp={birthdaysThisMonth.length > 0}
          color="pink"
        />
        <StatCard
          title="Bills Due"
          value={billsDue.length}
          icon={<CreditCard className="w-6 h-6" />}
          trend={billsDue.length > 0 ? 'Pay soon' : 'All clear'}
          trendUp={billsDue.length === 0}
          color="emerald"
        />
      </div>

      {/* Today's Reminders & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Reminders */}
        <GlassCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-500" />
              Today & Upcoming
            </h2>
            <button
              onClick={() => navigate('/reminders')}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              View all
            </button>
          </div>

          {todayReminders.length === 0 && upcoming.length === 0 ? (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No reminders for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center gap-4 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl"
                >
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {reminder.title}
                    </p>
                    <p className="text-sm text-primary-600 dark:text-primary-400">Today</p>
                  </div>
                  <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-md">
                    {reminder.type}
                  </span>
                </div>
              ))}
              {upcoming.slice(0, 5 - todayReminders.length).map((reminder) => {
                const days = getDaysUntil(reminder.date);
                return (
                  <div
                    key={reminder.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl"
                  >
                    <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {reminder.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {days === 1 ? 'Tomorrow' : `In ${days} days`}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-md">
                      {reminder.type}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>

        {/* Recent Notes */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-500" />
              Recent Notes
            </h2>
            <button
              onClick={() => navigate('/notes')}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              View all
            </button>
          </div>

          {recentNotes.length === 0 ? (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No notes yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => navigate('/notes')}
                  className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {note.isPrivate ? '🔒 Private Note' : note.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {note.isPrivate ? 'Content hidden' : note.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className="px-2 py-0.5 text-xs rounded-md"
                      style={{
                        backgroundColor: categories.find((c) => c.name === note.category)?.color + '20',
                        color: categories.find((c) => c.name === note.category)?.color,
                      }}
                    >
                      {note.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Overdue Section */}
      {overdueReminders.length > 0 && (
        <GlassCard className="p-6 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
              Overdue ({overdueReminders.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {overdueReminders.map((reminder) => (
              <div
                key={reminder.id}
                className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl"
              >
                <p className="font-medium text-gray-900 dark:text-white">{reminder.title}</p>
                <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                  Was due {Math.abs(getDaysUntil(reminder.date))} days ago
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}

