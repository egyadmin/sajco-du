import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNavigation from './MobileNavigation';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  const { direction, language } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const contentVariants = {
    initial: { opacity: 0, x: direction === 'rtl' ? 20 : -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction === 'rtl' ? -20 : 20 }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={direction}>
      <div className={`lg:block ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>
      <Header onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <AnimatePresence mode="wait">
        <motion.main
          key={language}
          variants={contentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="lg:mr-64 px-4 lg:px-6 pt-20 pb-20 lg:pb-6"
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </motion.main>
      </AnimatePresence>
      <MobileNavigation />
    </div>
  );
};

export default Layout;