import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Eye, CheckCircle, Clock, MapPin, Calendar, Bell, User, LogOut } from 'lucide-react';
import { ViewMode, FoundItem } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getFoundItemsByUser, getNotificationsByUser } from '../utils/storage';
import { getCategoryById } from '../utils/categories';

interface DashboardProps {
  onViewChange: (view: ViewMode) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'items' | 'notifications'>('items');
  
  const userItems = user ? getFoundItemsByUser(user.email) : [];
  const userNotifications = user ? getNotificationsByUser(user.email) : [];
  const unreadCount = userNotifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    onViewChange('home');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'from-green-500 to-emerald-500';
      case 'claimed': return 'from-blue-500 to-cyan-500';
      case 'contacted': return 'from-orange-500 to-yellow-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'claimed': return 'Claimed';
      case 'contacted': return 'Owner Contacted';
      default: return 'Unknown';
    }
  };

  if (!user) {
    onViewChange('login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <motion.button
            onClick={() => onViewChange('home')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 px-4 py-2 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </motion.button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 px-4 py-2 rounded-xl">
              <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="text-gray-800 dark:text-white font-medium">{user.name}</span>
            </div>
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Dashboard Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">Your Dashboard</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Manage your found items and notifications
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-3xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white">{userItems.length}</div>
                <div className="text-gray-600 dark:text-gray-300">Items Found</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-3xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                  {userItems.filter(item => item.status === 'claimed').length}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Items Claimed</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-3xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center relative">
                <Bell className="w-6 h-6 text-white" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{unreadCount}</span>
                  </div>
                )}
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white">{userNotifications.length}</div>
                <div className="text-gray-600 dark:text-gray-300">Notifications</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 mb-8"
        >
          <motion.button
            onClick={() => setActiveTab('items')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'items'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 text-gray-600 dark:text-gray-300'
            }`}
          >
            <Package className="w-5 h-5" />
            My Found Items
          </motion.button>
          
          <motion.button
            onClick={() => setActiveTab('notifications')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all relative ${
              activeTab === 'notifications'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 text-gray-600 dark:text-gray-300'
            }`}
          >
            <Bell className="w-5 h-5" />
            Notifications
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">{unreadCount}</span>
              </div>
            )}
          </motion.button>
        </motion.div>

        {/* Content */}
        {activeTab === 'items' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {userItems.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-4">No Items Found Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">
                  Start helping others by reporting found items!
                </p>
                <motion.button
                  onClick={() => onViewChange('found-form')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg"
                >
                  Report Found Item
                </motion.button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userItems.map((item, index) => {
                  const category = getCategoryById(item.category);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-3xl overflow-hidden shadow-xl"
                    >
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden relative">
                        <img
                          src={item.photo}
                          alt="Found item"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${category?.color} text-white shadow-lg`}>
                            {category?.icon} {category?.name}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor(item.status)} text-white shadow-lg`}>
                            {getStatusText(item.status)}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-3">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate font-medium">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                        {item.status === 'claimed' && item.claimedBy && (
                          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-3">
                            <p className="text-sm text-green-700 dark:text-green-300">
                              <CheckCircle className="w-4 h-4 inline mr-1" />
                              Claimed by: {item.claimedBy}
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                              {item.claimedAt && formatDate(item.claimedAt)}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {userNotifications.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bell className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-4">No Notifications</h3>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  You'll receive notifications when someone claims your found items.
                </p>
              </div>
            ) : (
              userNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 ${
                    !notification.read ? 'ring-2 ring-blue-500/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      notification.type === 'item_claimed' ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                      notification.type === 'contact_request' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                      'bg-gradient-to-br from-orange-500 to-red-500'
                    }`}>
                      {notification.type === 'item_claimed' ? <CheckCircle className="w-6 h-6 text-white" /> :
                       notification.type === 'contact_request' ? <Eye className="w-6 h-6 text-white" /> :
                       <Bell className="w-6 h-6 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800 dark:text-white">{notification.title}</h3>
                        {!notification.read && (
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">{notification.message}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(notification.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;