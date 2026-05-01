import { generateId } from './helpers.js';

export const getDefaultCategories = () => [
  { id: generateId(), name: 'Personal', color: '#3b82f6', icon: 'User' },
  { id: generateId(), name: 'Family', color: '#ec4899', icon: 'Heart' },
  { id: generateId(), name: 'Work', color: '#8b5cf6', icon: 'Briefcase' },
  { id: generateId(), name: 'Finance', color: '#10b981', icon: 'Wallet' },
  { id: generateId(), name: 'Ideas', color: '#f59e0b', icon: 'Lightbulb' },
];

export const getSampleNotes = () => {
  const now = new Date().toISOString();
  return [
    {
      id: generateId(),
      title: 'Welcome to Digital Memory Vault',
      description: 'This is your secure personal space to store memories, notes, and important reminders. You can pin notes, mark them as private, and organize them with categories and tags.',
      category: 'Personal',
      tags: ['welcome', 'getting-started'],
      createdAt: now,
      updatedAt: now,
      isPinned: true,
      isPrivate: false,
    },
    {
      id: generateId(),
      title: 'Mom\'s Pasta Recipe',
      description: 'Ingredients: 2 cups flour, 3 eggs, pinch of salt. Mix dry ingredients, create well, add eggs, knead for 10 mins. Rest 30 mins. Roll and cut. Boil 3-4 mins.',
      category: 'Family',
      tags: ['recipe', 'cooking'],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      isPinned: false,
      isPrivate: true,
    },
    {
      id: generateId(),
      title: 'Project Launch Strategy',
      description: 'Phase 1: Market research and competitor analysis. Phase 2: MVP development with core features. Phase 3: Beta testing with 100 users. Phase 4: Public launch with marketing campaign.',
      category: 'Work',
      tags: ['project', 'strategy'],
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      isPinned: true,
      isPrivate: false,
    },
    {
      id: generateId(),
      title: 'Monthly Budget Plan',
      description: 'Rent: $1200, Groceries: $400, Utilities: $150, Savings: $500, Entertainment: $200. Total budget: $2450. Review on the 1st of every month.',
      category: 'Finance',
      tags: ['budget', 'monthly'],
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      isPinned: false,
      isPrivate: true,
    },
    {
      id: generateId(),
      title: 'App Feature Ideas',
      description: '1. Voice note input for quick capture. 2. AI-powered summarization. 3. Shared vaults with family members. 4. Photo memories with date tagging. 5. Mood tracking integration.',
      category: 'Ideas',
      tags: ['features', 'innovation'],
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      isPinned: false,
      isPrivate: false,
    },
  ];
};

export const getSampleReminders = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();

  const createDate = (m, d, y = year) => new Date(y, m, d).toISOString();

  return [
    {
      id: generateId(),
      title: 'Dad\'s Birthday',
      date: createDate(month, day + 3),
      type: 'Birthday',
      repeatYearly: true,
      reminderDays: 1,
      notified: false,
      createdAt: createDate(month, day - 10),
    },
    {
      id: generateId(),
      title: 'Electricity Bill Due',
      date: createDate(month, day + 5),
      type: 'Bill Due Date',
      repeatYearly: false,
      reminderDays: 1,
      notified: false,
      createdAt: createDate(month, day - 5),
    },
    {
      id: generateId(),
      title: 'Wedding Anniversary',
      date: createDate(month + 1, 15),
      type: 'Anniversary',
      repeatYearly: true,
      reminderDays: 7,
      notified: false,
      createdAt: createDate(month, 1),
    },
    {
      id: generateId(),
      title: 'Quarterly Tax Filing',
      date: createDate(month, day + 10),
      type: 'Deadline',
      repeatYearly: false,
      reminderDays: 3,
      notified: false,
      createdAt: createDate(month, day - 2),
    },
    {
      id: generateId(),
      title: 'Team Standup Meeting',
      date: createDate(month, day),
      type: 'Meeting',
      repeatYearly: false,
      reminderDays: 0,
      notified: false,
      createdAt: createDate(month, day - 1),
    },
    {
      id: generateId(),
      title: 'Car Insurance Renewal',
      date: createDate(month + 2, 5),
      type: 'Custom Reminder',
      repeatYearly: true,
      reminderDays: 7,
      notified: false,
      createdAt: createDate(month, 5),
    },
  ];
};

