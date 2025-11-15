import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const handleLogout = () => {
    logout();
    closeMenu();
    setIsProfileOpen(false);
    navigate("/signin", { replace: true });
  };

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
    { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
  ];

  const currentLang = languages.find((lang) => lang.code === language) || languages[0];
  const profileEmail = user?.email || "";
  const profileInitial =
    profileEmail?.trim()?.slice(0, 2)?.toUpperCase() ||
    t("nav.profileInitial") ||
    "P";
  const profileHandle = profileEmail.split("@")[0] || t("nav.user") || "User";

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
            {isAuthenticated && (
              <>
                {user?.isAdmin ? (
                  <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition">
                    Admin Panel
                  </Link>
                ) : (
                  <Link to="/contribute" className="text-gray-700 hover:text-blue-600 transition">
                    {t("nav.contribute")}
                  </Link>
                )}
              </>
            )}
            
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

            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Account Menu"
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-purple-500 text-white font-semibold tracking-wide shadow-inner">
                    {profileInitial}
                  </span>
                  <span className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-gray-800 leading-tight">
                      {profileHandle}
                    </span>
                    <span className="text-xs text-gray-500">{profileEmail}</span>
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? "rotate-180" : ""
                      }`}
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

                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsProfileOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 py-3">
                      <div className="px-4 pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-purple-500 text-white text-lg font-semibold shadow-inner">
                            {profileInitial}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {profileHandle}
                        </p>
                            <p className="text-xs text-gray-500">{profileEmail}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition"
                        >
                          <svg
                            className="w-4 h-4 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5.121 17.804A4 4 0 017 16h10a4 4 0 011.879.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {t("nav.profile") || "Profile"}
                        </Link>
                      </div>
                      <div className="mt-1 pt-2 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                            />
                          </svg>
                          {t("nav.signOut") || "Sign Out"}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/signin"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                {t("nav.signIn")}
              </Link>
            )}
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
          {isAuthenticated && (
            <>
              {user?.isAdmin ? (
                <Link
                  to="/admin"
                  className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded"
                  onClick={closeMenu}
                >
                  Admin Panel
                </Link>
              ) : (
                <Link
                  to="/contribute"
                  className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded"
                  onClick={closeMenu}
                >
                  {t("nav.contribute")}
                </Link>
              )}
            </>
          )}
          
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

          {isAuthenticated ? (
            <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-3 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-xl p-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-purple-500 text-white text-lg font-semibold shadow-inner">
                  {profileInitial}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {profileHandle}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{profileEmail}</p>
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="mt-1 inline-flex text-xs text-blue-600 hover:underline"
                  >
                    {t("nav.viewProfile") || "View Profile"}
                  </Link>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition text-center font-semibold"
              >
                {t("nav.signOut") || "Sign Out"}
              </button>
            </div>
          ) : (
            <Link
              to="/signin"
              className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-center"
              onClick={closeMenu}
            >
              {t("nav.signIn")}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
