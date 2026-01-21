import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center font-medium"
            title={language === 'en' ? 'Switch to Chinese' : '切换到英文'}
        >
            <Globe size={20} className="mr-0 md:mr-1" />
            <span className="hidden md:inline text-xs uppercase w-4 text-center">
                {language}
            </span>
        </button>
    );
};

export default LanguageSwitcher;
