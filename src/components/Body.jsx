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
        className="relative flex items-center justify-center h-[80vh] w-full bg-center bg-cover rounded-b-3xl overflow-hidden"
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

      {/* Values Section */}
      <section className="text-center py-16 px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {t("home.valuesTitle")}
        </h2>
        <p className="text-gray-600 mb-12">
          {t("home.valuesSubtitle")}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {[
            { title: t("home.researchTitle"), desc: t("home.researchDesc"), icon: "🔬" },
            { title: t("home.yagyopathyTitle"), desc: t("home.yagyopathyDesc"), icon: "🔥" },
            { title: t("home.ayurvedaTitle"), desc: t("home.ayurvedaDesc"), icon: "🌱" },
            { title: t("home.transformationTitle"), desc: t("home.transformationDesc"), icon: "🌞" },
            { title: t("home.educationTitle"), desc: t("home.educationDesc"), icon: "📚" },

          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {(showAllVideos ? researchVideos : researchVideos.slice(0, 4)).map((tour, index) => (
                <div
                  key={tour.videoId || tour.youtube || index}
                  className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition flex flex-col"
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
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-2">
                      {tour.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{tour.desc}</p>
                    {tour.price && (
                      <p className="text-blue-600 font-semibold mb-4">{tour.price}</p>
                    )}
                    <a
                      href={tour.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto bg-red-600 text-white px-4 py-2 rounded-full text-center hover:bg-red-700 transition"
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


    </div>
  );
};

export default Body;
