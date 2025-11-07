import React, { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const Contribute = () => {
  const [isVisible, setIsVisible] = useState({});
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    gayatriPariwarDuration: "",
    akhandJyotiMember: "",
    guruDiksha: "",
    missionBooksRead: "",
    researchCategory: "",
    researchTopic: "",
    otherTopic: "",
    hoursPerWeek: "",
    consent: false,
  });

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

  const researchCategories = {
    "mental-health": {
      name: "Mental Health, Psychology & Community Well-being",
      topics: [
        "Mental health and emotional well-being",
        "Community-level trauma healing",
        "Suicide and youth mental health",
        "De-addiction and rehabilitation",
        "Rural–urban psychology",
        "Elderly welfare",
      ],
    },
    "education": {
      name: "Education, Youth & Social Development",
      topics: [
        "Dropout prevention and inclusive education",
        "Life-skills-based non-formal education",
        "Mother tongue-based education",
        "Local impact of National Education Policy (NEP)",
        "Establishing a national model of education",
        "Civic education and public participation",
        "Youth straying from their goals",
      ],
    },
    "gender-equality": {
      name: "Gender, Equality & Social Justice",
      topics: [
        "Women's empowerment and participation in governance",
        "Caste, gender, and economic inequality",
        "LGBTQ+ rights (under discussion)",
        "Social justice and legal literacy",
        "Access to justice for marginalized communities",
        "Disability inclusion and accessibility",
      ],
    },
    "health-nutrition": {
      name: "Health, Nutrition & Traditional Medicine",
      topics: [
        "Ayurveda and traditional medicine systems",
        "Tribal and folk medicine",
        "Traditional diets and nutritional science",
        "Child malnutrition and infant health",
        "Anemia in adolescent girls and women",
        "Public health services and ASHA workers",
      ],
    },
    "environment": {
      name: "Environment, Climate & Sustainability",
      topics: [
        "Sustainable agriculture and organic farming",
        "Indigenous seed conservation and soil health",
        "Farmer income security",
        "Food security and distribution systems",
        "Climate change and ecological restoration",
        "Waste management and public behavior",
        "Health impacts of air pollution",
        "Community water conservation",
        "Water resource management",
      ],
    },
    "culture-heritage": {
      name: "Culture, Heritage & Indigenous Knowledge",
      topics: [
        "Oral traditions and folk knowledge",
        "Preservation of folk arts and handicrafts",
        "Endangered languages and dialects",
        "Impact of urbanization on culture",
        "Religious harmony and dialogue",
      ],
    },
    "rural-development": {
      name: "Rural Development, Governance & Policy",
      topics: [
        "Rural migration and urbanization",
        "Tribal development and displacement",
        "Land rights and rural laws",
        "Labor rights and the unorganized sector",
        "Policy impact assessment",
        "Economics for social behavior change",
        "Human-centered urban planning",
      ],
    },
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "researchCategory") {
      setSelectedCategory(value);
      setFormData((prev) => ({
        ...prev,
        researchTopic: "",
        otherTopic: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.consent) {
      alert("Please provide consent to participate in the volunteering activity.");
      return;
    }
    alert("Thank you for your contribution! We'll get back to you soon.");
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "",
      gayatriPariwarDuration: "",
      akhandJyotiMember: "",
      guruDiksha: "",
      missionBooksRead: "",
      researchCategory: "",
      researchTopic: "",
      otherTopic: "",
      hoursPerWeek: "",
      consent: false,
    });
    setSelectedCategory("");
  };

  const selectedCategoryData = selectedCategory ? researchCategories[selectedCategory] : null;

  return (
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
                      {t("contribute.guruDikshaQuestion") || "Have you taken Guru Diksha?"} {" "}
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
                      {t("contribute.missionBooksQuestion") || "How many mission books have you read?"} {" "}
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
                    <label className="block text-gray-700 font-semibold mb-2">
                      {t("contribute.researchCategory")} <span className="text-red-500">{t("common.required")}</span>
                    </label>
                    <select
                      name="researchCategory"
                      value={formData.researchCategory}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-white"
                      required
                    >
                      <option value="">{t("contribute.selectCategory")}</option>
                      {Object.entries(researchCategories).map(([key, category]) => (
                        <option key={key} value={key}>
                          {category.name}
                        </option>
                      ))}
                      <option value="other">Other (Please specify)</option>
                    </select>
                  </div>

                  {selectedCategoryData && (
                    <div className="animate-fade-in">
                      <label className="block text-gray-700 font-semibold mb-2">
                        {t("contribute.researchTopic")} <span className="text-red-500">{t("common.required")}</span>
                      </label>
                      <select
                        name="researchTopic"
                        value={formData.researchTopic}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-white"
                        required
                      >
                        <option value="">{t("contribute.selectTopic")}</option>
                        {selectedCategoryData.topics.map((topic, idx) => (
                          <option key={idx} value={topic}>
                            {topic}
                          </option>
                        ))}
                        <option value="other">Other (Please specify)</option>
                      </select>
                    </div>
                  )}

                  {(formData.researchCategory === "other" ||
                    formData.researchTopic === "other") && (
                    <div className="animate-fade-in">
                      <label className="block text-gray-700 font-semibold mb-2">
                        {t("contribute.specifyInterest")}
                        <span className="text-red-500">{t("common.required")}</span>
                      </label>
                      <textarea
                        name="otherTopic"
                        value={formData.otherTopic}
                        onChange={handleChange}
                        rows="3"
                        placeholder={t("contribute.describeInterest")}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition resize-none"
                        required
                      ></textarea>
                    </div>
                  )}
                </div>
              </div>

              {/* Contribution Details */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">⏰</span> {t("contribute.contributionDetails")}
                </h3>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {t("contribute.hoursQuestion")}{" "}
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
                className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 text-white py-4 rounded-xl font-bold text-lg hover:from-yellow-600 hover:via-orange-600 hover:to-amber-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex justify-center items-center gap-2"
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
                  <span>{t("contribute.submitButton")}</span>
              </button>

              <p className="text-xs text-gray-500 text-center">
                {t("contribute.formPrivacy")}
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contribute;

