import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

const ResearchWork = () => {
  const [isVisible, setIsVisible] = useState({});
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
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
        className="relative flex items-center justify-center h-[60vh] bg-cover bg-center pt-16 overflow-hidden"
        style={{ backgroundImage: "url('/Herosection.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-5xl font-extrabold mb-4 animate-fade-in">Research Work</h1>
          <p className="text-lg max-w-xl mx-auto">
            Exploring innovative solutions through rigorous research and evidence-based approaches
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section 
        className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 max-w-5xl mx-auto"
        data-animate
        id="intro"
      >
        <div 
          className={`bg-gradient-to-r from-blue-50 to-indigo-50 shadow-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 transform transition-all duration-700 ${
            isVisible.intro ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
            Our Research Initiatives
          </h2>
          <div className="space-y-4 sm:space-y-6 text-gray-700 text-base sm:text-lg leading-relaxed">
            <p>
              At BVSS, we are committed to conducting comprehensive research that addresses critical 
              challenges facing our society. Our research work spans multiple domains, from mental 
              health and education to environmental sustainability and social justice.
            </p>
            <p>
              Through rigorous methodologies and evidence-based approaches, we aim to generate insights 
              that can inform policy, drive social change, and create meaningful impact in communities 
              across India and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Ongoing Researches */}
      <section 
        className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-white"
        data-animate
        id="ongoing"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 sm:mb-12 text-center px-4">
            Ongoing Researches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                slug: "mantr-chikitsa",
                image: "/GayatriDevi.jpg",
                icon: "🧠",
                title: "Mantr Chikitsa",
                description: "Research on Mantr Chikitsa for mental health, and  well-being in Teenagers."
              },
              {
                slug: "ayurvedic-research-for-public-health",
                image: "https://images.unsplash.com/photo-1492552085122-36706c238263?q=80&w=2097&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                icon: "🌾",
                title: "Ayurvedic Research for public health",
                  description: "Studies on Ayurvedic remedies for public health."
                },
              {
                slug: "waste-management-and-recycling",
                image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                icon: "📚",
                title: "Waste management and recycling",
                description: "Studies on waste management and recycling."
              }
            ].map((research, idx) => (
              <Link
                key={idx}
                to={`/research-work/${research.slug}`}
                className={`block bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer ${
                  isVisible.ongoing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {/* Image at the top */}
                <div className="w-full h-48 sm:h-56 overflow-hidden">
                  <img
                    src={research.image}
                    alt={research.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80";
                      e.target.onerror = null;
                    }}
                  />
                </div>
                {/* Content below image */}
                <div className="p-6 sm:p-8">
                  <div className="text-4xl sm:text-5xl mb-3">{research.icon}</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">{research.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {research.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Research Methodology */}
      <section 
        className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-gradient-to-br from-gray-50 to-blue-50"
        data-animate
        id="methodology"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 sm:mb-12 text-center px-4">
            Our Research Methodology
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {[
              {
                step: "01",
                title: "Problem Identification",
                description: "We identify critical issues through community engagement, stakeholder consultations, and literature review."
              },
              {
                step: "02",
                title: "Research Design",
                description: "We develop comprehensive research frameworks using mixed-methods approaches, ensuring rigor and relevance."
              },
              {
                step: "03",
                title: "Data Collection",
                description: "We employ ethical data collection practices, working closely with communities to gather authentic insights."
              },
              {
                step: "04",
                title: "Analysis & Insights",
                description: "We analyze data using advanced methodologies to extract meaningful patterns and actionable insights."
              },
              {
                step: "05",
                title: "Dissemination",
                description: "We share findings through publications, workshops, and policy briefs to maximize impact."
              },
              {
                step: "06",
                title: "Implementation",
                description: "We work with partners to translate research findings into practical solutions and interventions."
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isVisible.methodology ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {/*  */}
    </div>
  );
};

export default ResearchWork;

