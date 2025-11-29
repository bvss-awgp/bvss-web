import React, { useState, useEffect } from "react";
import { getApiUrl } from "../Config/api";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Check localStorage first for quick check
    const localConsent = localStorage.getItem('cookieConsent');
    if (localConsent === 'accepted') {
      const localPrefs = localStorage.getItem('cookiePreferences');
      if (localPrefs) {
        try {
          const prefs = JSON.parse(localPrefs);
          setPreferences({
            essential: prefs.essential !== undefined ? prefs.essential : true,
            analytics: prefs.analytics !== undefined ? prefs.analytics : false,
            marketing: prefs.marketing !== undefined ? prefs.marketing : false,
            preferences: prefs.preferences !== undefined ? prefs.preferences : false,
          });
          setShowBanner(false);
          return;
        } catch (e) {
          console.error("Error parsing local preferences:", e);
        }
      }
    }

    // Check if user has already accepted cookies from database
    const checkCookieConsent = async () => {
      try {
        const response = await fetch(getApiUrl("/cookies"), {
          credentials: "include",
        });
        const data = await response.json();
        
        if (data.preferences && data.preferences.accepted) {
          // User has already accepted, don't show banner
          setShowBanner(false);
          setPreferences({
            essential: data.preferences.essential !== undefined ? data.preferences.essential : true,
            analytics: data.preferences.analytics !== undefined ? data.preferences.analytics : false,
            marketing: data.preferences.marketing !== undefined ? data.preferences.marketing : false,
            preferences: data.preferences.preferences !== undefined ? data.preferences.preferences : false,
          });
          // Update localStorage
          localStorage.setItem('cookieConsent', 'accepted');
          localStorage.setItem('cookiePreferences', JSON.stringify(data.preferences));
        } else {
          // Show banner if not accepted
          setShowBanner(true);
        }
      } catch (error) {
        console.error("Error checking cookie preferences:", error);
        // Show banner if error (first visit)
        setShowBanner(true);
      }
    };

    checkCookieConsent();
  }, []);

  const savePreferences = async (accepted, customPrefs = null) => {
    try {
      const prefsToSave = customPrefs || preferences;
      console.log("Saving cookie preferences:", { ...prefsToSave, accepted });
      
      const response = await fetch(getApiUrl("/cookies"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...prefsToSave,
          accepted: accepted,
        }),
      });

      const data = await response.json();
      console.log("Cookie save response:", data);

      if (response.ok) {
        // Store in localStorage to remember preference
        localStorage.setItem('cookieConsent', 'accepted');
        localStorage.setItem('cookiePreferences', JSON.stringify({ ...prefsToSave, accepted }));
        
        setShowBanner(false);
        setShowManage(false);
        
        // Small delay before showing success
        setTimeout(() => {
          alert("Cookie preferences saved successfully!");
        }, 100);
      } else {
        console.error("Failed to save preferences:", data.message);
        alert("Failed to save cookie preferences: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saving cookie preferences:", error);
      alert("Error saving cookie preferences: " + error.message);
    }
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setPreferences(allAccepted);
    savePreferences(true, allAccepted);
  };

  const handleAcceptEssential = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setPreferences(essentialOnly);
    savePreferences(true, essentialOnly);
  };

  const handleSavePreferences = () => {
    savePreferences(true, preferences);
  };

  if (!showBanner && !showManage) {
    return null;
  }

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && !showManage && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-2xl border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Cookie Consent</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                  By clicking "Accept All", you consent to our use of cookies. You can also choose to accept only essential cookies 
                  or manage your preferences.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAcceptEssential}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition"
                >
                  Essential Only
                </button>
                <button
                  onClick={() => setShowManage(true)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition"
                >
                  Manage Cookies
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Cookies Modal */}
      {showManage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={(e) => {
            // Close modal when clicking outside (on overlay)
            if (e.target === e.currentTarget) {
              setShowManage(false);
            }
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Cookie Preferences</h2>
                <button
                  onClick={() => {
                    setShowManage(false);
                    if (!showBanner) {
                      setShowBanner(true);
                    }
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Manage your cookie preferences. You can enable or disable different types of cookies below.
              </p>

              <div className="space-y-6">
                {/* Essential Cookies */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">Essential Cookies</h3>
                      <p className="text-sm text-gray-600">
                        These cookies are necessary for the website to function and cannot be switched off.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.essential}
                        disabled
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-blue-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 mr-4">
                      <h3 className="font-semibold text-gray-900">Analytics Cookies</h3>
                      <p className="text-sm text-gray-600">
                        These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPreferences({ ...preferences, analytics: !preferences.analytics })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        preferences.analytics ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 mr-4">
                      <h3 className="font-semibold text-gray-900">Marketing Cookies</h3>
                      <p className="text-sm text-gray-600">
                        These cookies are used to deliver personalized advertisements and track campaign effectiveness.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPreferences({ ...preferences, marketing: !preferences.marketing })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        preferences.marketing ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.marketing ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Preferences Cookies */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 mr-4">
                      <h3 className="font-semibold text-gray-900">Preference Cookies</h3>
                      <p className="text-sm text-gray-600">
                        These cookies remember your choices and preferences to provide a more personalized experience.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPreferences({ ...preferences, preferences: !preferences.preferences })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        preferences.preferences ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.preferences ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAcceptEssential}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Essential Only
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;

