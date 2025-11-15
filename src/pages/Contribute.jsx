import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { getApiUrl } from "../Config/api";

const Contribute = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState({});
  const { t } = useLanguage();
  const { token, user, isAuthenticated } = useAuth();
  const createEmptyForm = useCallback(
    () => ({
      firstName: "",
      lastName: "",
      email: user?.email || "",
      phone: "",
      gender: "",
      gayatriPariwarDuration: "",
      akhandJyotiMember: "",
      guruDiksha: "",
      missionBooksRead: "",
      researchCategories: [],
      hoursPerWeek: "",
      consent: false,
    }),
    [user?.email]
  );
  const [formData, setFormData] = useState(() => createEmptyForm());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [hasExistingContribution, setHasExistingContribution] = useState(false);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    let isActive = true;

    const loadContribution = async () => {
      try {
        setIsLoadingProfile(true);
        const response = await fetch(getApiUrl("/contributions/me"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Unable to fetch saved contribution details.");
        }

        const payload = await response.json().catch(() => null);
        if (!isActive) {
          return;
        }

        if (!payload?.contribution) {
          setFormData(createEmptyForm());
          setHasExistingContribution(false);
          setShowForm(true);
          return;
        }

        // User has already contributed - don't pre-fill, just show the message
        setHasExistingContribution(true);
        setShowForm(false);
        setFormData(createEmptyForm());
      } catch (error) {
        console.error(error);
      } finally {
        if (isActive) {
          setIsLoadingProfile(false);
        }
      }
    };

    loadContribution();

    return () => {
      isActive = false;
    };
  }, [token, user?.email, createEmptyForm]);

  useEffect(() => {
    if (showConfirmation) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showConfirmation, navigate]);

  const researchCategoryOptions = [
    {
      value: "mental-health",
      label: "Mental Health, Psychology & Community Well-being",
    },
    {
      value: "education",
      label: "Education, Youth & Social Development",
    },
    {
      value: "gender-equality",
      label: "Gender, Equality & Social Justice",
    },
    {
      value: "health-nutrition",
      label: "Health, Nutrition & Traditional Medicine",
    },
    {
      value: "environment",
      label: "Environment, Climate & Sustainability",
    },
    {
      value: "culture-heritage",
      label: "Culture, Heritage & Indigenous Knowledge",
    },
    {
      value: "rural-development",
      label: "Rural Development, Governance & Policy",
    },
    {
      value: "information-technology",
      label: "Impact of Internet, AI  in Todays Life",
    }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleResearchCategory = (category) => {
    setFormData((prev) => {
      const isSelected = prev.researchCategories.includes(category);
      const nextCategories = isSelected
        ? prev.researchCategories.filter((c) => c !== category)
        : [...prev.researchCategories, category];

      return {
        ...prev,
        researchCategories: nextCategories,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setErrorMessage("Please sign in to submit your contribution details.");
      return;
    }

    if (formData.researchCategories.length < 3) {
      setErrorMessage("Please select at least three research categories.");
      return;
    }

    if (!formData.consent) {
      setErrorMessage("Please provide consent to participate in the volunteering activity.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const payload = {
        ...formData,
        email: formData.email || user?.email || "",
      };

      const response = await fetch(getApiUrl("/contributions"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message = data?.message || "Unable to save your contribution details.";
        throw new Error(message);
      }

      const successMessage = data?.message || "Thank you! Your contribution profile has been saved.";
      setStatusMessage(successMessage);
      setConfirmationMessage(successMessage);
      setShowConfirmation(true);
      setFormData(createEmptyForm());
      setHasExistingContribution(true);
      setShowForm(false);
    } catch (error) {
      console.error("Contribution submission failed:", error);
      setErrorMessage(error.message || "Unable to save your contribution details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowConfirmation(false)}
          ></div>
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900">Contribution Submitted</h3>
            <p className="mt-3 text-sm text-gray-600">{confirmationMessage}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="inline-flex items-center rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:from-yellow-600 hover:to-orange-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
        {/* Hero Section */}
        <section
          className="relative py-16 md:py-24 overflow-hidden"
          data-animate
          id="contribute-hero"
        >
          {/* Spiritual Background Patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 text-9xl text-amber-400">ॐ</div>
            <div className="absolute bottom-20 right-10 text-7xl text-orange-400">☸</div>
          </div>

          {/* Scientific Geometric Patterns */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-32 right-32 w-64 h-64 border-4 border-orange-300 rounded-full transform rotate-45"></div>
            <div className="absolute bottom-32 left-32 w-80 h-80 border-4 border-yellow-300 rounded-lg transform -rotate-12"></div>
          </div>

          <div
            className={`relative z-10 max-w-7xl mx-auto px-6 text-center transform transition-all duration-1000 ${
              isVisible["contribute-hero"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                {t("contribute.joinMission")}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              {t("contribute.title")}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t("contribute.subtitle")}
            </p>
          </div>
        </section>

        {/* Main Form Section */}
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div
            data-animate
            id="contribute-form"
          >
            <div
              className={`bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl transform transition-all duration-700 ${
                isVisible["contribute-form"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              {hasExistingContribution && !showForm ? (
                <div className="text-center py-12">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-4">
                      <svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">
                      You Have Already Contributed
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                      Thank you for your previous contribution! Your profile has been recorded. Would you like to submit another contribution?
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(true);
                        setFormData(createEmptyForm());
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white px-8 py-4 font-bold text-lg hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                    >
                      Contribute Again
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-3 rounded-xl">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">{t("contribute.volunteerRegistration")}</h2>
                      <p className="text-gray-600">{t("contribute.helpUs")}</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                {!isAuthenticated && (
                  <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
                    Please sign in to save your contribution profile.
                  </div>
                )}

                {isLoadingProfile && (
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                    Loading your saved contribution details...
                  </div>
                )}

                {statusMessage && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {statusMessage}
                  </div>
                )}

                {errorMessage && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                  </div>
                )}

                {/* Personal Information */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">👤</span> {t("contribute.personalInfo")}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        {t("contribute.firstName")} <span className="text-red-500">{t("common.required")}</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder={t("contribute.firstName")}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        {t("contribute.lastName")} <span className="text-red-500">{t("common.required")}</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder={t("contribute.lastName")}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        {t("contribute.email")} <span className="text-red-500">{t("common.required")}</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t("contribute.email")}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        {t("contribute.phone")} <span className="text-red-500">{t("common.required")}</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t("contribute.phone")}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        {t("contribute.gender")} <span className="text-red-500">{t("common.required")}</span>
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-white"
                        required
                      >
                        <option value="">{t("contribute.selectGender")}</option>
                        <option value="male">{t("contribute.male")}</option>
                        <option value="female">{t("contribute.female")}</option>
                        <option value="other">{t("contribute.other")}</option>
                        <option value="prefer-not-to-say">{t("contribute.preferNotToSay")}</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Spiritual Connection */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🕉️</span> {t("contribute.spiritualConnection")}
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        {t("contribute.gayatriQuestion")}{" "}
                        <span className="text-red-500">{t("common.required")}</span>
                      </label>
                      <select
                        name="gayatriPariwarDuration"
                        value={formData.gayatriPariwarDuration}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-white"
                        required
                      >
                        <option value="">{t("contribute.selectDuration")}</option>
                        <option value="less-than-1">{t("contribute.lessThan1")}</option>
                        <option value="1-3">{t("contribute.years1to3")}</option>
                        <option value="3-5">{t("contribute.years3to5")}</option>
                        <option value="5-10">{t("contribute.years5to10")}</option>
                        <option value="more-than-10">{t("contribute.moreThan10")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        {t("contribute.akhandJyotiQuestion")}{" "}
                        <span className="text-red-500">{t("common.required")}</span>
                      </label>
                      <select
                        name="akhandJyotiMember"
                        value={formData.akhandJyotiMember}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-white"
                        required
                      >
                        <option value="">{t("contribute.selectOption")}</option>
                        <option value="yes">{t("contribute.yes")}</option>
                        <option value="no">{t("contribute.no")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        {t("Have you taken Guru Diksha?")} {" "}
                        <span className="text-red-500">{t("common.required")}</span>
                      </label>
                      <select
                        name="guruDiksha"
                        value={formData.guruDiksha}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-white"
                        required
                      >
                        <option value="">{t("contribute.selectOption")}</option>
                        <option value="yes">{t("contribute.yes")}</option>
                        <option value="no">{t("contribute.no")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        {t("How many mission books have you read?")} {" "}
                        <span className="text-red-500">{t("common.required")}</span>
                      </label>
                      <select
                        name="missionBooksRead"
                        value={formData.missionBooksRead}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-white"
                        required
                      >
                        <option value="">{t("Select Option")}</option>
                        {[...Array(10)].map((_, idx) => (
                          <option key={idx} value={`${idx + 1}`}>
                            {idx + 1}
                          </option>
                        ))}
                        <option value="10+">10+</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Research Interests */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🔬</span> {t("contribute.researchInterests")}
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-gray-700 font-semibold mb-2">
                        {t("contribute.researchCategory")} <span className="text-red-500">{t("common.required")}</span>
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        Select at least three categories that reflect your interests and experience.
                      </p>
                      <div className="grid md:grid-cols-2 gap-3">
                        {researchCategoryOptions.map((category) => (
                          <label
                            key={category.value}
                            className="flex items-start gap-3 bg-white/80 border-2 border-gray-200 rounded-xl px-4 py-3 shadow-sm"
                          >
                            <input
                              type="checkbox"
                              value={category.value}
                              checked={formData.researchCategories.includes(category.value)}
                              onChange={() => toggleResearchCategory(category.value)}
                              className="mt-1 w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                            />
                            <span className="text-sm text-gray-700">{category.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Video Contribution */}
                <div className="bg-gradient-to-r from-sky-50 to-indigo-50 rounded-2xl p-6">
                  <h3 className="text-2xl font-extrabold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-3xl">🎥</span> Video Contribution
                  </h3>
                  <p className="text-base md:text-lg text-gray-700 font-semibold mb-3">
                    We sincerely express our gratitude to you for offering your valuable time to the Brahmarishi Vishwamitra Research Center (under the All World Gayatri Pariwar).
                  </p>
                  <p className="text-base md:text-lg text-gray-700 font-semibold mb-3">
                    With the divine inspiration of Param Pujya Gurudev, the Brahmarishi Vishwamitra Research Center, being carried forward under the DIYA Group of the Gayatri Pariwar, is preparing research-based video content for the welfare of society, nation-building, and public awareness.
                  </p>
                  <p className="text-base md:text-lg text-gray-700 font-semibold">
                    After filling out the form you will receive an email regarding the video contribution guidelines.
                  </p>
                </div>

                {/* Contribution Details */}
                <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">⏰</span> {t("contribute.contributionDetails")}
                  </h3>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      {t("contribute.hoursQuestion")} {" "}
                      <span className="text-red-500">{t("common.required")}</span>
                    </label>
                    <select
                      name="hoursPerWeek"
                      value={formData.hoursPerWeek}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-white"
                      required
                    >
                      <option value="">{t("contribute.selectHours")}</option>
                      <option value="1-5">{t("contribute.hours1to5")}</option>
                      <option value="5-10">{t("contribute.hours5to10")}</option>
                      <option value="10-15">{t("contribute.hours10to15")}</option>
                      <option value="15-20">{t("contribute.hours15to20")}</option>
                      <option value="20+">{t("contribute.hours20Plus")}</option>
                    </select>
                  </div>
                </div>

                {/* Consent */}
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleChange}
                      className="mt-2 w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      required
                    />
                    <label className="text-gray-700 font-semibold flex-1">
                      <span className="text-red-500">{t("common.required")}</span> {t("contribute.consent")}
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !isAuthenticated}
                  className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 text-white py-4 rounded-xl font-bold text-lg hover:from-yellow-600 hover:via-orange-600 hover:to-amber-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{isSubmitting ? "Saving..." : t("contribute.submitButton")}</span>
                </button>

                <p className="text-xs text-gray-500 text-center">
                  {t("contribute.formPrivacy")}
                </p>
              </form>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contribute;

