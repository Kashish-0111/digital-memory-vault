export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const sendNotification = (title, options = {}) => {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const defaultOptions = {
    icon: '/vault-icon.svg',
    badge: '/vault-icon.svg',
    tag: 'dmv-reminder',
    requireInteraction: true,
    ...options,
  };

  try {
    new Notification(title, defaultOptions);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

export const checkAndSendReminders = (reminders, settings) => {
  if (!settings?.notificationsEnabled) return;
  if (Notification.permission !== 'granted') return;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  reminders.forEach((reminder) => {
    if (reminder.notified) return;

    const reminderDate = new Date(reminder.date);
    const reminderDayStart = new Date(
      reminderDate.getFullYear(),
      reminderDate.getMonth(),
      reminderDate.getDate()
    );

    const notifyDate = new Date(reminderDayStart);
    notifyDate.setDate(notifyDate.getDate() - (reminder.reminderDays || 0));

    if (todayStart >= notifyDate && todayStart <= reminderDayStart) {
      const daysUntil = Math.ceil((reminderDayStart - todayStart) / (1000 * 60 * 60 * 24));
      let body = '';
      if (daysUntil === 0) {
        body = `${reminder.type} is today!`;
      } else if (daysUntil === 1) {
        body = `${reminder.type} is tomorrow!`;
      } else {
        body = `${reminder.type} in ${daysUntil} days.`;
      }

      sendNotification(reminder.title, { body });
    }
  });
};

export const getTodayReminders = (reminders) => {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return reminders.filter((reminder) => {
    const d = new Date(reminder.date);
    const reminderStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return reminderStr === todayStr;
  });
};

export const getUpcomingReminders = (reminders, days = 30) => {
  const now = new Date();
  const future = new Date();
  future.setDate(future.getDate() + days);

  return reminders.filter((reminder) => {
    const d = new Date(reminder.date);
    return d >= now && d <= future;
  });
};

export const getBirthdaysThisMonth = (reminders) => {
  const today = new Date();
  const currentMonth = today.getMonth();

  return reminders.filter((reminder) => {
    if (reminder.type !== 'Birthday') return false;
    const d = new Date(reminder.date);
    return d.getMonth() === currentMonth;
  });
};

