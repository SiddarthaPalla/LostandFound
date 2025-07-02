import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Clock, Search, AlertCircle, CheckCircle, Filter, X } from 'lucide-react';
import { ViewMode, FoundItem, Notification } from '../types';
import { getFoundItems, updateFoundItem, saveNotification, generateId } from '../utils/storage';
import { categories, getCategoryById } from '../utils/categories';
import { useAuth } from '../contexts/AuthContext';

interface LostItemsGridProps {
  onViewChange: (view: ViewMode) => void;
}

const LostItemsGrid: React.FC<LostItemsGridProps> = ({ onViewChange }) => {
  const { user } = useAuth();
  const [items] = useState<FoundItem[]>(getFoundItems().filter(item => item.status === 'available'));
  const [selectedItem, setSelectedItem] = useState<FoundItem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [claimerEmail, setClaimerEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showResult, setShowResult] = useState<'correct' | 'incorrect' | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.date.includes(searchTerm);
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, selectedCategory]);

  const handleItemClick = (item: FoundItem) => {
    setSelectedItem(item);
    setUserAnswer('');
    setClaimerEmail('');
    setShowResult(null);
  };

  const handleAnswerSubmit = () => {
    if (!selectedItem || !claimerEmail.trim()) return;
    
    const isCorrect = userAnswer.toLowerCase().trim() === selectedItem.securityAnswer.toLowerCase().trim();
    setShowResult(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
      // Update item status
      updateFoundItem(selectedItem.id, {
        status: 'claimed',
        claimedBy: claimerEmail,
        claimedAt: Date.now()
      });

      // Create notification for the finder
      const notification: Notification = {
        id: generateId(),
        type: 'item_claimed',
        title: '🎉 Your Found Item Has Been Claimed!',
        message: `Great news! Someone has successfully claimed the ${getCategoryById(selectedItem.category)?.name} you found at ${selectedItem.location}. The owner answered your security question correctly and provided their contact: ${claimerEmail}`,
        itemId: selectedItem.id,
        fromUser: claimerEmail,
        toUser: selectedItem.finderEmail,
        read: false,
        createdAt: Date.now()
      };

      saveNotification(notification);

      setTimeout(() => {
        setSelectedItem(null);
        setUserAnswer('');
        setClaimerEmail('');
        setShowResult(null);
        // Refresh the page to update the items list
        window.location.reload();
      }, 4000);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

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
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search by location or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 w-64"
              />
            </div>

            {/* Filter Toggle */}
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                showFilters || selectedCategory
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 text-gray-600 dark:text-gray-300'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
            </motion.button>
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Filter by Category</h3>
                {(searchTerm || selectedCategory) && (
                  <motion.button
                    onClick={clearFilters}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear All
                  </motion.button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(selectedCategory === category.id ? '' : category.id)}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                      selectedCategory === category.id
                        ? `border-transparent bg-gradient-to-r ${category.color} text-white shadow-lg`
                        : 'border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="text-xl mb-1">{category.icon}</div>
                    <div className="text-xs font-medium">{category.name}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title and Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">Found Items</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} waiting to be claimed
          </p>
        </motion.div>
        
        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-16 h-16 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-4">No Items Found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">
              {searchTerm || selectedCategory ? 'Try adjusting your search or filters' : 'Be the first to report a found item!'}
            </p>
            {(searchTerm || selectedCategory) && (
              <motion.button
                onClick={clearFilters}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
              >
                Clear Filters
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredItems.map((item, index) => {
              const category = getCategoryById(item.category);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  onClick={() => handleItemClick(item)}
                  className="group cursor-pointer bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-3xl overflow-hidden hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden relative">
                    <img
                      src={item.photo}
                      alt="Found item"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${category?.color} text-white shadow-lg`}>
                        {category?.icon} {category?.name}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate font-medium">{item.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(item.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(item.time)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Claim Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <AnimatePresence mode="wait">
                {showResult === 'correct' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Perfect Match! ✨</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                      You answered correctly! The finder has been notified and will contact you at <strong>{claimerEmail}</strong> soon.
                    </p>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-700">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        💡 <strong>Next steps:</strong> The finder will reach out to you directly to arrange pickup.
                      </p>
                    </div>
                  </motion.div>
                ) : showResult === 'incorrect' ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      className="w-20 h-20 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <AlertCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Not Quite Right</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      That answer doesn't match. Please try again or contact campus security if you're sure this is your item.
                    </p>
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => setShowResult(null)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors font-medium"
                      >
                        Try Again
                      </motion.button>
                      <motion.button
                        onClick={() => setSelectedItem(null)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="question"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Is This Your Item?</h3>
                    <div className="mb-6">
                      <img
                        src={selectedItem.photo}
                        alt="Found item"
                        className="w-full h-48 object-cover rounded-2xl mb-4 shadow-lg"
                      />
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <span className="text-2xl">{getCategoryById(selectedItem.category)?.icon}</span>
                          <span className="font-medium">{getCategoryById(selectedItem.category)?.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <MapPin className="w-4 h-4" />
                          <span>{selectedItem.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(selectedItem.date)} at {formatTime(selectedItem.time)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Your Email Address *
                        </label>
                        <input
                          type="email"
                          value={claimerEmail}
                          onChange={(e) => setClaimerEmail(e.target.value)}
                          placeholder="Enter your email for contact"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <strong>Security Question:</strong> {selectedItem.securityQuestion}
                        </label>
                        <input
                          type="text"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Enter your answer"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          onKeyPress={(e) => e.key === 'Enter' && userAnswer.trim() && claimerEmail.trim() && handleAnswerSubmit()}
                          autoFocus
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => setSelectedItem(null)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        onClick={handleAnswerSubmit}
                        disabled={!userAnswer.trim() || !claimerEmail.trim()}
                        whileHover={{ scale: userAnswer.trim() && claimerEmail.trim() ? 1.05 : 1 }}
                        whileTap={{ scale: userAnswer.trim() && claimerEmail.trim() ? 0.95 : 1 }}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg"
                      >
                        Submit Claim
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LostItemsGrid;