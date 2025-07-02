import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Search, Package, User, LogIn, Bell } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';
import { getNotificationsByUser } from '../utils/storage';

interface NavbarProps {
  onViewChange: (view: 'home' | 'found-form' | 'lost-items' | 'login' | 'dashboard') => void;
  currentView: string;
}

const Navbar: React.FC<NavbarProps> = ({ onViewChange, currentView }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  
  const unreadNotifications = user ? getNotificationsByUser(user.email).filter(n => !n.read).length : 0;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.button
            onClick={() => onViewChange('home')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            Lost & Found
          </motion.button>

          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => onViewChange('lost-items')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                currentView === 'lost-items'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Search className="w-4 h-4" />
              Browse Items
            </motion.button>

            {isAuthenticated ? (
              <>
                <motion.button
                  onClick={() => onViewChange('found-form')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    currentView === 'found-form'
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  Report Found
                </motion.button>

                <motion.button
                  onClick={() => onViewChange('dashboard')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all relative ${
                    currentView === 'dashboard'
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Dashboard
                  {unreadNotifications > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{unreadNotifications}</span>
                    </div>
                  )}
                </motion.button>
              </>
            ) : (
              <motion.button
                onClick={() => onViewChange('login')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  currentView === 'login'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </motion.button>
            )}

            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;