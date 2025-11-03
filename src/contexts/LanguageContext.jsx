import React, { createContext, useContext } from "react";
import { useTranslation } from "react-i18next";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { i18n, t: i18nT } = useTranslation();

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    document.documentElement.lang = langCode;
  };

  const t = (key, options) => {
    return i18nT(key, options);
  };

  const value = {
    language: i18n.language,
    setLanguage: changeLanguage,
    t,
    i18n,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

