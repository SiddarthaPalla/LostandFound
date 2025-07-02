import React from 'react';
import { motion } from 'framer-motion';
import { Search, Package, MapPin, Calendar, Sparkles } from 'lucide-react';
import { ViewMode, FoundItem } from '../types';
import { getFoundItems } from '../utils/storage';
import { getCategoryById } from '../utils/categories';

interface HomePageProps {
  onViewChange: (view: ViewMode) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onViewChange }) => {
  const recentItems = getFoundItems().slice(-6);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const FloatingIcon = ({ icon: Icon, delay = 0 }: { icon: any, delay?: number }) => (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [-10, 10, -10] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
      className="absolute opacity-10 dark:opacity-5"
    >
      <Icon className="w-8 h-8 text-blue-500" />
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 pt-16">
      {/* Floating Background Icons */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingIcon icon={Search} delay={0} />
        <FloatingIcon icon={Package} delay={1} />
        <FloatingIcon icon={Sparkles} delay={2} />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20 px-6 py-3 rounded-full mb-8 border border-blue-200/50 dark:border-blue-400/30"
          >
            <Sparkles className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            <span className="text-blue-600 dark:text-blue-300 font-medium">Campus Lost & Found Portal</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Lost something?
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Or Found something?
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Help reunite lost items with their owners on our college campus. 
            Our smart matching system makes it easy to report found items or claim what's yours.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto"
          >
            <motion.button
              onClick={() => onViewChange('lost-items')}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-6 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <Search className="w-6 h-6" />
                I Lost Something
              </div>
            </motion.button>

            <motion.button
              onClick={() => onViewChange('found-form')}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-12 py-6 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <Package className="w-6 h-6" />
                I Found Something
              </div>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Recent Items Section */}
        {recentItems.length > 0 && (
          <motion.div variants={itemVariants} className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Recently Found Items
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Check if any of these items belong to you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentItems.map((item, index) => {
                const category = getCategoryById(item.category);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    onClick={() => onViewChange('lost-items')}
                    className="group cursor-pointer bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-3xl overflow-hidden hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 shadow-xl hover:shadow-2xl"
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                      <img
                        src={item.photo}
                        alt="Found item"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">{category?.icon}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${category?.color} text-white`}>
                          {category?.name}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-12"
            >
              <motion.button
                onClick={() => onViewChange('lost-items')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-2xl font-semibold hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View All Found Items →
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* Stats Section */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-3xl p-8">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {getFoundItems().length}
            </div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">Items Found</div>
          </div>
          <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-3xl p-8">
            <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">24/7</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">Always Available</div>
          </div>
          <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-3xl p-8">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">100%</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">Secure & Private</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;