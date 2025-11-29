import React, { createContext, useContext, useCallback, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../Config/api";

const LanguageContext = createContext();

// Translation cache to store loaded translations
const translationCache = new Map();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { i18n, t: i18nT } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  // Load translations from API immediately
  const loadTranslations = useCallback(async (langCode) => {
    // If English, no need to load
    if (langCode === 'en') {
      return true;
    }

    // Check if already cached
    if (translationCache.has(langCode)) {
      const cached = translationCache.get(langCode);
      i18n.addResourceBundle(langCode, 'translation', cached, true, true);
      return true;
    }

    // Check if already loaded in i18n
    if (i18n.hasResourceBundle(langCode, 'translation')) {
      return true;
    }

    try {
      setIsLoading(true);
      const response = await fetch(getApiUrl(`/translate/${langCode}`));
      
      if (!response.ok) {
        console.error(`Failed to load translations for ${langCode}`);
        return false;
      }

      const data = await response.json();
      const translations = data.translations || {};
      
      // Cache translations
      translationCache.set(langCode, translations);
      
      // Add to i18n immediately
      i18n.addResourceBundle(langCode, 'translation', translations, true, true);
      
      return true;
    } catch (error) {
      console.error(`Error loading translations for ${langCode}:`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [i18n]);

  const changeLanguage = useCallback(async (langCode) => {
    // Load translations first, then change language
    await loadTranslations(langCode);
    
    // Change language immediately
    await i18n.changeLanguage(langCode);
    document.documentElement.lang = langCode;
  }, [i18n, loadTranslations]);

  // Preload all languages on mount
  useEffect(() => {
    const languages = ['hi', 'gu', 'kn'];
    // Preload all languages in parallel
    languages.forEach(lang => {
      loadTranslations(lang).catch(err => {
        console.error(`Failed to preload ${lang}:`, err);
      });
    });
  }, [loadTranslations]);

  const t = useCallback((key, options) => {
    // Try to get translation
    let translation = i18nT(key, options);
    
    // If translation key is same as result and not English, fallback to English
    if (translation === key && i18n.language !== 'en') {
      const fallbackTranslation = i18nT(key, { ...options, lng: 'en' });
      return fallbackTranslation || key;
    }
    
    return translation;
  }, [i18nT, i18n.language]);

  const value = {
    language: i18n.language,
    setLanguage: changeLanguage,
    t,
    i18n,
    isLoadingTranslations: isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

