import React from 'react';
import { useStore } from '../store/useStore';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useStore();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
    // Update HTML lang and dir attributes
    document.documentElement.lang = language === 'ar' ? 'en' : 'ar';
    document.documentElement.dir = language === 'ar' ? 'ltr' : 'rtl';
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm border hover:bg-gray-50 transition-colors"
      title={language === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
    >
      <Globe className="w-4 h-4 text-blue-600" />
      <span className="text-sm font-medium">
        {language === 'ar' ? 'English' : 'العربية'}
      </span>
    </motion.button>
  );
};

export default LanguageSwitcher;