import { useEffect, useRef } from 'react';
import { requestNotificationPermission, checkAndSendReminders } from '../services/notifications.js';

export function useNotifications(reminders, settings) {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!settings?.notificationsEnabled) return;

    requestNotificationPermission();

    checkAndSendReminders(reminders, settings);

    intervalRef.current = setInterval(() => {
      checkAndSendReminders(reminders, settings);
    }, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [reminders, settings]);

  return null;
}

