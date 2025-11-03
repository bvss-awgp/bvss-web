import React, { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const About = () => {
  const [isVisible, setIsVisible] = useState({});
  const { t } = useLanguage();

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

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center h-[60vh] bg-cover bg-center rounded-b-3xl overflow-hidden"
        style={{ backgroundImage: "url('/Herosection.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-5xl font-extrabold mb-4 animate-fade-in">{t("about.title")}</h1>
          <p className="text-lg max-w-xl mx-auto">
            {t("about.heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Introduction (Who We Are) */}
      <section 
        className="py-16 px-6 max-w-5xl mx-auto"
        data-animate
        id="intro"
      >
        <div 
          className={`bg-gradient-to-r from-blue-50 to-indigo-50 shadow-xl rounded-2xl p-8 md:p-12 transform transition-all duration-700 ${
            isVisible.intro ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
            <p className="italic text-xl">
              {t("about.intro1")}
            </p>
            <p>
              {t("about.intro2")}
            </p>
            <p>
              {t("about.intro3")}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section 
        className="py-16 px-6 text-center max-w-5xl mx-auto"
        data-animate
        id="mission-vision"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-12">{t("about.missionTitle")} & {t("about.visionTitle")}</h2>
        <div className="grid md:grid-cols-2 gap-12">
          {/* Mission with YouTube Video */}
          <div 
            className={`bg-white shadow-xl rounded-2xl p-8 transform transition-all duration-700 hover:scale-105 flex flex-col ${
              isVisible['mission-vision'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">{t("about.missionTitle")}</h3>
            <ul className="text-gray-600 mb-6 space-y-4 text-left list-disc list-inside flex-grow">
              <li>{t("about.mission1")}</li>
              <li>{t("about.mission2")}</li>
              <li>{t("about.mission3")}</li>
              <li>{t("about.mission4")}</li>
              <li>{t("about.mission5")}</li>
            </ul>
            {/* Embedded YouTube Video */}
            <div className="relative rounded-xl overflow-hidden shadow-lg mt-auto" style={{ paddingTop: "56.25%" }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/gxqQvPuKNUU?si=HwUmLfuozdaH20r8"
                title="Mission Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Vision */}
          <div 
            className={`bg-white shadow-xl rounded-2xl p-8 transform transition-all duration-700 hover:scale-105 flex flex-col ${
              isVisible['mission-vision'] ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-10'
            }`}
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">{t("about.visionTitle")}</h3>
            <div className="text-gray-700 text-lg leading-relaxed mb-6 space-y-4 flex-grow">
              <p>
                {t("about.visionText")}
              </p>
              <p className="text-gray-600 text-base">
                {t("about.visionAdditional")}
              </p>
            </div>
            {/* Embedded YouTube Video */}
            <div className="relative rounded-xl overflow-hidden shadow-lg mt-auto" style={{ paddingTop: "56.25%" }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/IAhj5-ZK2O4?si=OyaBP3aMm8hKb6Tv"
                title="Vision Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>


      {/* Affiliation & Inspiration */}
      <section 
        className="py-16 px-6 bg-gradient-to-br from-purple-100 to-pink-100 text-center max-w-5xl mx-auto rounded-2xl mb-6"
        data-animate
        id="affiliation"
      >
        <div 
          className={`transform transition-all duration-700 ${
            isVisible.affiliation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-8">{t("about.affiliationTitle")}</h2>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 mb-6 shadow-lg">
            <p className="text-gray-700 max-w-3xl mx-auto mb-6 text-lg leading-relaxed">
              {t("about.affiliation1")}
            </p>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              {t("about.affiliation2")}
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="https://play-lh.googleusercontent.com/KL4RaeG0P-Z29pn3pqhq3ZMfoR0_nkdfLnlpmEsVw42woWTtT_CfT5JA2_musl2e02XJ"
              alt="AWGP"
              className="rounded-xl shadow-xl w-64 h-64 object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>
      </section>

      {/* Our Work & Initiatives */}
      <section 
        className="py-16 px-6 text-center bg-gray-100"
        data-animate
        id="work"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-8">{t("about.workTitle")}</h2>
        <div 
          className={`max-w-4xl mx-auto mb-12 transform transition-all duration-700 ${
            isVisible.work ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
            <p className="text-gray-700 text-lg leading-relaxed">
              {t("about.workText")}
            </p>
          </div>
          <p className="max-w-3xl mx-auto text-gray-600 mb-12 text-lg">
            {t("about.workSubtext")}
          </p>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: "🔬", title: "Scientific Research", desc: "We conduct rigorous studies to explore spiritual phenomena and their impact on human well-being.", color: "from-blue-500 to-cyan-500" },
            { icon: "🕉️", title: "Spiritual Practices", desc: "Integrating time-tested practices like Yagya, meditation, and self-refinement for holistic growth.", color: "from-purple-500 to-pink-500" },
            { icon: "🌱", title: "Community Engagement", desc: "Empowering communities with knowledge, workshops, and outreach programs.", color: "from-green-500 to-emerald-500" },
          ].map((item, idx) => (
            <div 
              key={idx} 
              className={`bg-gradient-to-br ${item.color} text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="text-6xl mb-4">{item.icon}</div>
              <h3 className="font-semibold text-xl mb-4">{item.title}</h3>
              <p className="text-white/90">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section 
        className="py-16 px-6 bg-white text-center"
        data-animate
        id="team"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-12">{t("about.teamTitle")}</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {[
            { name: "Mr. Vivek Bhagel", role: "Founder & Research Lead", image: "/About/vivek.jpg" },
            { name: "Mr Suyash Soni", role: "Software Engineer & Manager", image: "/About/suyash.jpg" },
            { name: "Prof. Jagriti Kawde", role: "Research Assistant", image: "/About/jagriti.jpg" },
            { name: "Dr Vaidehi Puri", role: "Research Assistant", image: "/About/vaidehi.jpg" },
            { name: "Mrs Prachi Pawar", role: "Research Assistant / Content and Reach", image: "/About/prachi.jpg" },
          ].map((member, idx) => (
            <div 
              key={idx} 
              className={`bg-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 ${
                isVisible.team ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = '/Logo.jpg';
                    e.target.onerror = null;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values / Philosophy */}
      <section 
        className="py-16 px-6 text-center max-w-6xl mx-auto bg-gradient-to-b from-gray-50 to-white"
        data-animate
        id="values"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-12">{t("about.valuesTitle")}</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            { title: t("about.value1Title"), desc: t("about.value1Desc"), icon: "✨", color: "from-amber-400 to-orange-500" },
            { title: t("about.value2Title"), desc: t("about.value2Desc"), icon: "❤️", color: "from-red-400 to-pink-500" },
            { title: t("about.value3Title"), desc: t("about.value3Desc"), icon: "🌍", color: "from-green-400 to-teal-500" },
            { title: t("about.value4Title"), desc: t("about.value4Desc"), icon: "🧘", color: "from-indigo-400 to-purple-500" },
            { title: t("about.value5Title"), desc: t("about.value5Desc"), icon: "🤝", color: "from-blue-400 to-cyan-500" },
          ].map((value, idx) => (
            <div 
              key={idx} 
              className={`bg-gradient-to-br ${value.color} p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-1 ${
                isVisible.values ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="text-5xl mb-4">{value.icon}</div>
              <h3 className="font-semibold text-white text-lg mb-3">{value.title}</h3>
              <p className="text-white/90 text-sm leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section 
        className="py-20 px-6 text-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-t-3xl relative overflow-hidden"
        data-animate
        id="cta"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div 
          className={`relative z-10 max-w-4xl mx-auto transform transition-all duration-700 ${
            isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t("about.ctaTitle")}</h2>
          <p className="text-white text-lg md:text-xl mb-4 max-w-3xl mx-auto leading-relaxed">
            {t("about.ctaText")}
          </p>
          <p className="text-white/90 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            {t("about.ctaSubtext")}
          </p>
          <button className="bg-white text-indigo-600 px-10 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-white/50">
            {t("about.ctaButton")}
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
