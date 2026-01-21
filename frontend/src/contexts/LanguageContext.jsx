import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../locales/en';
import { zh } from '../locales/zh';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Try to get language from localStorage, or default to system preference, or default to 'zh'
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('appLanguage');
        if (saved) return saved;

        // Check system preference
        const userLang = navigator.language || navigator.userLanguage;
        return userLang.startsWith('zh') ? 'zh' : 'en';
    });

    const [translations, setTranslations] = useState(language === 'zh' ? zh : en);

    useEffect(() => {
        localStorage.setItem('appLanguage', language);
        setTranslations(language === 'zh' ? zh : en);
    }, [language]);

    const t = (key, params = {}) => {
        let value = translations[key] || key;

        // Replace placeholders like {{count}}
        Object.keys(params).forEach(param => {
            value = value.replace(`{{${param}}}`, params[param]);
        });

        return value;
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'zh' : 'en');
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
