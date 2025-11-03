import { useEffect } from "react";

/**
 * Google Translate Widget Component
 * 
 * This component adds Google Translate widget to automatically translate the entire website.
 * Note: This is an alternative to manual translations and works by translating the HTML content.
 * 
 * To use this, add the script to index.html and uncomment the component in App.jsx
 */
const GoogleTranslateWidget = () => {
  useEffect(() => {
    // Add Google Translate script if not already added
    if (!window.google || !window.google.translate) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      // Initialize Google Translate
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi,gu,kn", // Languages you want to support
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      };
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div id="google_translate_element"></div>
      <style jsx>{`
        /* Hide Google Translate branding */
        .goog-te-banner-frame {
          display: none !important;
        }
        .goog-te-balloon-frame {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
        /* Style the language selector */
        #google_translate_element select {
          padding: 8px 12px;
          border-radius: 8px;
          border: 2px solid #2563eb;
          background: white;
          color: #1f2937;
          font-weight: 500;
          cursor: pointer;
        }
        #google_translate_element select:hover {
          border-color: #1d4ed8;
        }
      `}</style>
    </div>
  );
};

export default GoogleTranslateWidget;

