import React, { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const Contact = () => {
  const [isVisible, setIsVisible] = useState({});
  const { t } = useLanguage();
  const [researchCount, setResearchCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);
  const [hasCounted, setHasCounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    inquiryType: "research",
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
            
            // Trigger counter animation when stats section is visible
            if (entry.target.id === 'contact-info' && !hasCounted) {
              setHasCounted(true);
              animateCounter(50, setResearchCount, 2000); // 50 over 2 seconds
              animateCounter(1000, setMemberCount, 2000); // 1000 over 2 seconds
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [hasCounted]);

  const animateCounter = (target, setCount, duration) => {
    const startTime = performance.now();
    const startValue = 0;

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "", inquiryType: "research" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section 
        className="relative py-16 md:py-24 overflow-hidden"
        data-animate
        id="contact-hero"
      >
        {/* Scientific Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 border-2 border-blue-400 rounded-full transform rotate-45"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 border-2 border-purple-400 rounded-full transform -rotate-12"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-48 h-48 border border-indigo-300 rounded-lg transform rotate-45"></div>
          </div>
        </div>

        {/* Spiritual Symbols Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-32 right-32 text-8xl">ॐ</div>
          <div className="absolute bottom-32 left-32 text-6xl">☸</div>
        </div>

        <div 
          className={`relative z-10 max-w-7xl mx-auto px-6 text-center transform transition-all duration-1000 ${
            isVisible['contact-hero'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
              {t("contact.connectWithUs")}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            {t("contact.title")}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("contact.subtitle")}
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{t("contact.quickResponse")}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{t("contact.confidential")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Side - Information */}
          <div 
            className="space-y-8"
            data-animate
            id="contact-info"
          >
            <div 
              className={`transform transition-all duration-700 ${
                isVisible['contact-info'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{t("contact.emailUs")}</h3>
                    <p className="text-gray-600">bvshodhsansthan@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Spiritual Quote */}
            <div 
              className={`bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl p-8 shadow-xl transform transition-all duration-700 ${
                isVisible['contact-info'] ? 'opacity-100 translate-x-0 delay-200' : 'opacity-0 -translate-x-10'
              }`}
            >
              <div className="text-6xl mb-4 text-center">🧘</div>
              <p className="text-gray-700 text-lg italic text-center mb-2">
                "{t("contact.spiritualQuote")}"
              </p>
              <p className="text-gray-500 text-sm text-center">{t("contact.quoteAuthor")}</p>
            </div>

            {/* Scientific Stats */}
            <div 
              className={`grid grid-cols-2 gap-4 transform transition-all duration-700 ${
                isVisible['contact-info'] ? 'opacity-100 translate-x-0 delay-300' : 'opacity-0 -translate-x-10'
              }`}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {researchCount}+
                </div>
                <div className="text-sm text-gray-600">{t("contact.researchStudies")}</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {memberCount.toLocaleString()}+
                </div>
                <div className="text-sm text-gray-600">{t("contact.communityMembers")}</div>
              </div>
            </div>

            {/* Call to Action */}
            <div 
              className={`bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl transform transition-all duration-700 ${
                isVisible['contact-info'] ? 'opacity-100 translate-x-0 delay-400' : 'opacity-0 -translate-x-10'
              }`}
            >
              <h3 className="text-xl font-bold mb-3">{t("contact.collaborateTitle")}</h3>
              <p className="text-blue-100 mb-4">
                {t("contact.collaborateText")}
              </p>
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                {t("contact.learnMore")}
              </button>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div 
            data-animate
            id="contact-form"
          >
            <div 
              className={`bg-white/90 backdrop-blur-sm rounded-2xl p-8 md:p-10 shadow-2xl transform transition-all duration-700 ${
                isVisible['contact-form'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{t("contact.sendMessage")}</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {t("contact.name")}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("contact.name")}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {t("contact.email")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t("contact.email")}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {t("contact.inquiryType")}
                  </label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                  >
                    <option value="research">{t("contact.inquiryResearch")}</option>
                    <option value="spiritual">{t("contact.inquirySpiritual")}</option>
                    <option value="volunteer">{t("contact.inquiryVolunteer")}</option>
                    <option value="donation">{t("contact.inquiryDonation")}</option>
                    <option value="feedback">{t("contact.inquiryFeedback")}</option>
                    <option value="other">{t("common.other")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {t("contact.message")}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder={t("contact.message")}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex justify-center items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>{t("contact.sendButton")}</span>
                </button>

                <p className="text-xs text-gray-500 text-center">
                  {t("contact.privacyNote")}
                </p>
              </form>
            </div>

            {/* Additional Info Cards */}
            <div 
              className="mt-6 grid md:grid-cols-2 gap-4"
              data-animate
              id="additional-info"
            >
              <div 
                className={`bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 shadow-lg transform transition-all duration-700 ${
                  isVisible['additional-info'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="text-3xl mb-3">🔬</div>
                <h3 className="font-bold text-gray-800 mb-2">{t("contact.researchFocus")}</h3>
                <p className="text-sm text-gray-600">
                  {t("contact.researchFocusText")}
                </p>
              </div>
              <div 
                className={`bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 shadow-lg transform transition-all duration-700 ${
                  isVisible['additional-info'] ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="text-3xl mb-3">🕉️</div>
                <h3 className="font-bold text-gray-800 mb-2">{t("contact.spiritualAlignment")}</h3>
                <p className="text-sm text-gray-600">
                  {t("contact.spiritualAlignmentText")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
