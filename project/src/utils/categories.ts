import { Category } from '../types';

export const categories: Category[] = [
  { id: 'electronics', name: 'Electronics', icon: '📱', color: 'from-blue-500 to-cyan-500' },
  { id: 'clothing', name: 'Clothing', icon: '👕', color: 'from-purple-500 to-pink-500' },
  { id: 'accessories', name: 'Accessories', icon: '👜', color: 'from-emerald-500 to-teal-500' },
  { id: 'books', name: 'Books', icon: '📚', color: 'from-orange-500 to-red-500' },
  { id: 'keys', name: 'Keys', icon: '🔑', color: 'from-yellow-500 to-orange-500' },
  { id: 'jewelry', name: 'Jewelry', icon: '💍', color: 'from-pink-500 to-rose-500' },
  { id: 'sports', name: 'Sports Equipment', icon: '⚽', color: 'from-green-500 to-emerald-500' },
  { id: 'other', name: 'Other', icon: '📦', color: 'from-gray-500 to-slate-500' }
];

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(cat => cat.id === id);
};