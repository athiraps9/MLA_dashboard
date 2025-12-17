import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en'); // 'en' or 'ml'

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'en' ? 'ml' : 'en'));
    };

    // Simple dictionary or translation helper could go here
    const t = (key, mlText) => {
        return language === 'ml' ? mlText : key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
