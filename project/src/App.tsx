import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import FoundForm from './components/FoundForm';
import LostItemsGrid from './components/LostItemsGrid';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import { ViewMode } from './types';
import { useTheme } from './hooks/useTheme';

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const { theme } = useTheme();

  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view);
  };

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  return (
    <div className={`min-h-screen font-sans antialiased ${theme}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <Navbar onViewChange={handleViewChange} currentView={currentView} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {currentView === 'home' && <HomePage onViewChange={handleViewChange} />}
            {currentView === 'found-form' && <FoundForm onViewChange={handleViewChange} />}
            {currentView === 'lost-items' && <LostItemsGrid onViewChange={handleViewChange} />}
            {currentView === 'login' && <LoginForm onViewChange={handleViewChange} />}
            {currentView === 'dashboard' && <Dashboard onViewChange={handleViewChange} />}
          </motion.div>
        </AnimatePresence>
        
        {currentView === 'home' && <Footer />}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;