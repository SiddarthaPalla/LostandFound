import { FoundItem, User, Notification } from '../types';

const STORAGE_KEY = 'lost-found-items';
const USERS_KEY = 'lost-found-users';
const NOTIFICATIONS_KEY = 'lost-found-notifications';
const THEME_KEY = 'lost-found-theme';
const CURRENT_USER_KEY = 'lost-found-current-user';

// Found Items
export const saveFoundItem = (item: FoundItem): void => {
  const existingItems = getFoundItems();
  const updatedItems = [...existingItems, item];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
};

export const updateFoundItem = (itemId: string, updates: Partial<FoundItem>): void => {
  const items = getFoundItems();
  const updatedItems = items.map(item => 
    item.id === itemId ? { ...item, ...updates } : item
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
};

export const getFoundItems = (): FoundItem[] => {
  const items = localStorage.getItem(STORAGE_KEY);
  return items ? JSON.parse(items) : [];
};

export const getFoundItemsByUser = (userEmail: string): FoundItem[] => {
  return getFoundItems().filter(item => item.finderEmail === userEmail);
};

// Users
export const saveUser = (user: User): void => {
  const existingUsers = getUsers();
  const updatedUsers = [...existingUsers, user];
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
};

export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const getUserByEmail = (email: string): User | null => {
  const users = getUsers();
  return users.find(user => user.email === email) || null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Notifications
export const saveNotification = (notification: Notification): void => {
  const existingNotifications = getNotifications();
  const updatedNotifications = [...existingNotifications, notification];
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
};

export const getNotifications = (): Notification[] => {
  const notifications = localStorage.getItem(NOTIFICATIONS_KEY);
  return notifications ? JSON.parse(notifications) : [];
};

export const getNotificationsByUser = (userEmail: string): Notification[] => {
  return getNotifications().filter(notification => notification.toUser === userEmail);
};

export const markNotificationAsRead = (notificationId: string): void => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notification =>
    notification.id === notificationId ? { ...notification, read: true } : notification
  );
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const saveTheme = (theme: string): void => {
  localStorage.setItem(THEME_KEY, theme);
};

export const getTheme = (): string => {
  return localStorage.getItem(THEME_KEY) || 'light';
};