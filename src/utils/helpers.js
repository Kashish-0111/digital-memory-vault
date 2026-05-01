import { format, isToday, isTomorrow, addDays, isBefore, isAfter, startOfDay, parseISO } from 'date-fns';

export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatDate = (date, pattern = 'MMM dd, yyyy') => {
  if (!date) return '';
  try {
    return format(new Date(date), pattern);
  } catch {
    return '';
  }
};

export const formatDateTime = (date) => {
  return formatDate(date, 'MMM dd, yyyy hh:mm a');
};

export const getRelativeDateLabel = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return formatDate(date);
};

export const isOverdue = (date) => {
  if (!date) return false;
  return isBefore(new Date(date), startOfDay(new Date()));
};

export const isUpcoming = (date, days = 7) => {
  if (!date) return false;
  const target = new Date(date);
  const now = new Date();
  const future = addDays(now, days);
  return isAfter(target, now) && !isAfter(target, future);
};

export const getDaysUntil = (date) => {
  if (!date) return null;
  const target = startOfDay(new Date(date));
  const today = startOfDay(new Date());
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  return diff;
};

export const downloadJSON = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadCSV = (rows, filename) => {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const cell = row[header] ?? '';
          const escaped = String(cell).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

export const hashPIN = async (pin) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + 'dmv-salt-2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const verifyPIN = async (pin, hashedPin) => {
  const hash = await hashPIN(pin);
  return hash === hashedPin;
};

