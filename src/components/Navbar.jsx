import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
    { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
  ];

  const currentLang = languages.find((lang) => lang.code === language) || languages[0];

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    setIsLangOpen(false);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" onClick={closeMenu} className="flex items-center">
              <img
                src="/Logo.jpg" // put your logo in public/logo.png
                alt="Logo"
                className="h-16 w-full" // adjust height as needed
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
              {t("nav.home")}
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition">
              {t("nav.about")}
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-blue-600 transition">
              {t("nav.blog")}
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition">
              {t("nav.contact")}
            </Link>
            <Link to="/contribute" className="text-gray-700 hover:text-blue-600 transition">
              {t("nav.contribute")}
            </Link>
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-gray-700 border border-gray-300"
                aria-label="Select Language"
              >
                <span className="text-lg">{currentLang.flag}</span>
                <span className="text-sm font-medium">{currentLang.name}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isLangOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              
              {isLangOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsLangOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20 py-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition flex items-center gap-3 ${
                          language === lang.code ? "bg-blue-50 text-blue-600" : "text-gray-700"
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                        {language === lang.code && (
                          <svg
                            className="w-4 h-4 ml-auto text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <Link
              to="/signin"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {t("nav.signIn")}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
            >
              {isOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-white shadow-md">
          <Link
            to="/"
            className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded"
            onClick={closeMenu}
          >
            {t("nav.home")}
          </Link>
          <Link
            to="/about"
            className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded"
            onClick={closeMenu}
          >
            {t("nav.about")}
          </Link>
          <Link
            to="/blog"
            className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded"
            onClick={closeMenu}
          >
            {t("nav.blog")}
          </Link>
          <Link
            to="/contact"
            className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded"
            onClick={closeMenu}
          >
            {t("nav.contact")}
          </Link>
          <Link
            to="/contribute"
            className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded"
            onClick={closeMenu}
          >
            {t("nav.contribute")}
          </Link>
          
          {/* Mobile Language Selector */}
          <div className="px-3 py-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("nav.selectLanguage")}
            </label>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          <Link
            to="/signin"
            className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-center"
            onClick={closeMenu}
          >
            {t("nav.signIn")}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
