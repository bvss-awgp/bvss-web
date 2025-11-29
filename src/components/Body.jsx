import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { getApiUrl } from "../Config/api";

const Body = () => {
  const { t } = useLanguage();
  
  const carouselTexts = [
    t("home.carousel1"),
    t("home.carousel2"),
    t("home.carousel3"),
    t("home.carousel4"),
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAllVideos, setShowAllVideos] = useState(false);
  const [researchVideos, setResearchVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [videoError, setVideoError] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselTexts.length);
    }, 4000); // slide every 4s

    return () => clearInterval(intervalRef.current);
  }, [carouselTexts.length]);

  // Fetch videos from YouTube API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoadingVideos(true);
        setVideoError(null);
        
        const response = await fetch(getApiUrl('youtube/videos?maxResults=12'));
        const data = await response.json();
        
        if (response.ok && data.videos && data.videos.length > 0) {
          // Format videos to match the expected structure
          const formattedVideos = data.videos.map((video) => ({
            videoId: video.videoId,
            image: video.thumbnail,
            title: video.title,
            price: video.author ? `- ${video.author}` : '',
            desc: video.description.length > 100 
              ? video.description.substring(0, 100) + '...' 
              : video.description || 'Watch this video to learn more.',
            youtube: video.youtube,
          }));
          setResearchVideos(formattedVideos);
        } else {
          // Fallback to empty array if no videos found
          setResearchVideos([]);
          if (data.message) {
            console.warn('YouTube API:', data.message);
          }
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        setVideoError(error.message);
        // Keep empty array on error - will show fallback message
        setResearchVideos([]);
      } finally {
        setLoadingVideos(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center h-[80vh] w-full bg-center bg-cover pt-16 overflow-hidden"
        style={{ backgroundImage: "url('Herosection.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-5xl font-extrabold mb-4">
            {t("home.title")}
          </h1>
          <h3 className="text-3xl font-extrabold mb-4">{t("home.subtitle")}</h3>

          {/* Smooth Slide Carousel */}
          <div className="overflow-hidden h-6 mb-2 relative">
            <div
              className="flex transition-transform duration-700"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {carouselTexts.map((text, idx) => (
                <p key={idx} className="min-w-full text-lg text-center">
                  {text}
                </p>
              ))}
            </div>
          </div>

          <a
            href="/contribute"
            className="inline-block bg-white text-black px-8 py-3 mt-5 rounded-full font-semibold hover:bg-gray-200 transition transform hover:scale-105"
          >
            {t("home.contributeButton")}
          </a>
        </div>
      </section>

      {/* Main Priorities Section */}
      <section className="text-center py-16 px-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Main Priorities</h2>
        <p className="text-gray-600 mb-12 text-lg max-w-3xl mx-auto">
          We focus on three critical areas that will shape a better future for our society and nation
        </p>
        <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-6xl mx-auto">
          {[
            { 
              icon: "📚", 
              title: "Education Reform", 
              desc: "Transforming education to ensure every student receives quality learning, fostering character alongside academics.",
              color: "from-blue-500 to-indigo-600" 
            },
            { 
              icon: "🌍", 
              title: "Global Warming", 
              desc: "Addressing climate change through research, sustainable practices, and environmental conservation.",
              color: "from-green-500 to-emerald-600" 
            },
            { 
              icon: "🎯", 
              title: "Youth Development", 
              desc: "Empowering the next generation through mentorship and life-skills education for nation-building.",
              color: "from-purple-500 to-pink-600" 
            },
          ].map((priority, idx) => (
            <div 
              key={idx} 
              className={`bg-gradient-to-br ${priority.color} text-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
            >
              <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 md:mb-4">{priority.icon}</div>
              <h3 className="font-semibold text-xs sm:text-sm md:text-xl mb-2 sm:mb-3">{priority.title}</h3>
              <p className="text-white/95 leading-relaxed text-[10px] sm:text-xs md:text-sm hidden sm:block">{priority.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="text-center py-16 px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {t("home.valuesTitle")}
        </h2>
        <p className="text-gray-600 mb-12">
          {t("home.valuesSubtitle")}
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
          {[
            { title: t("home.researchTitle"), desc: t("home.researchDesc"), icon: "🔬" },
            { title: t("home.yagyopathyTitle"), desc: t("home.yagyopathyDesc"), icon: "🔥" },
            { title: t("home.ayurvedaTitle"), desc: t("home.ayurvedaDesc"), icon: "🌱" },
            { title: t("home.transformationTitle"), desc: t("home.transformationDesc"), icon: "🌞" },
            { title: t("home.educationTitle"), desc: t("home.educationDesc"), icon: "📚" },

          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">{item.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-1 text-xs sm:text-sm md:text-base">{item.title}</h3>
              <p className="text-gray-600 text-[10px] sm:text-xs md:text-sm hidden sm:block">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tour Section */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
          {t("home.recentResearch")}
        </h2>

        {loadingVideos ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
              <p className="text-gray-600">{t("home.loadingVideos") || "Loading videos..."}</p>
            </div>
          </div>
        ) : videoError || researchVideos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              {videoError 
                ? t("home.videoError") || "Unable to load videos. Please try again later."
                : t("home.noVideos") || "No videos available at the moment."}
            </p>
            {videoError && (
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              >
                {t("home.retry") || "Retry"}
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
              {(showAllVideos ? researchVideos : researchVideos.slice(0, 4)).map((tour, index) => (
                <div
                  key={tour.videoId || tour.youtube || index}
                  className="bg-white shadow-md rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden hover:shadow-xl transition flex flex-col"
                >
                  <div className="relative">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // Fallback to a placeholder if image fails to load
                        e.target.src = 'https://via.placeholder.com/320x180?text=Video+Thumbnail';
                      }}
                    />
                  </div>
                  <div className="p-2 sm:p-3 md:p-5 flex flex-col flex-grow">
                    <h3 className="font-semibold text-xs sm:text-sm md:text-lg text-gray-800 mb-1 line-clamp-2">
                      {tour.title}
                    </h3>
                    <p className="text-gray-600 text-[10px] sm:text-xs md:text-sm mb-1 sm:mb-2 line-clamp-2 hidden sm:block">{tour.desc}</p>
                    {tour.price && (
                      <p className="text-blue-600 font-semibold text-xs sm:text-sm mb-2 sm:mb-4 hidden sm:block">{tour.price}</p>
                    )}
                    <a
                      href={tour.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto bg-red-600 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-center hover:bg-red-700 transition text-[10px] sm:text-xs md:text-sm"
                    >
                      {t("home.watchNow")}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {researchVideos.length > 4 && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAllVideos((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                >
                  {showAllVideos
                    ? t("home.showLess") || "Show Less"
                    : t("home.showAll") || "Show All"}
                  <svg
                    className={`h-4 w-4 transition-transform ${showAllVideos ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Research Areas Preview */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center">Our Research Focus</h2>
          <p className="text-gray-600 text-center mb-12 text-lg max-w-3xl mx-auto">
            We conduct comprehensive research across 45 identified areas addressing critical challenges in 
            mental health, agriculture, environment, education, social justice, and traditional knowledge systems.
          </p>
          
          <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {[
              { icon: "🧠", title: "Mental Health & Well-being", count: "4 Research Areas", desc: "Emotional wellness, trauma healing, and psychological support" },
              { icon: "🌾", title: "Agriculture & Environment", count: "8 Research Areas", desc: "Sustainable farming, climate change, and ecological restoration" },
              { icon: "🏥", title: "Traditional Medicine & Health", count: "4 Research Areas", desc: "Ayurveda, tribal medicine, and traditional healing systems" },
              { icon: "👥", title: "Social Development", count: "8 Research Areas", desc: "Gender equality, social justice, and community empowerment" },
              { icon: "📖", title: "Education", count: "5 Research Areas", desc: "Education reform, inclusive learning, and skill development" },
              { icon: "⚖️", title: "Legal & Governance", count: "4 Research Areas", desc: "Rights, justice, and policy impact assessment" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">{item.icon}</div>
                <h3 className="text-sm sm:text-base md:text-xl font-bold text-gray-800 mb-1 sm:mb-2">{item.title}</h3>
                <p className="text-blue-600 font-semibold text-xs sm:text-sm mb-1 sm:mb-2">{item.count}</p>
                <p className="text-gray-600 text-[10px] sm:text-xs md:text-sm hidden sm:block">{item.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <a
              href="/about"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition transform hover:scale-105"
            >
              Explore All Research Areas
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Impact</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { number: "45+", label: "Research Areas" },
              { number: "3", label: "Main Priorities" },
              { number: "15+", label: "Research Videos" },
              { number: "Growing", label: "Community" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Body;
