import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";

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
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselTexts.length);
    }, 4000); // slide every 4s

    return () => clearInterval(intervalRef.current);
  }, [carouselTexts.length]);

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

        {(() => {
          const researchVideos = [
            {
              image: "/Thumbnails/Vid_1.jpg",
              title: "Right and Wrong Use of Mobile and Internet",
              price: "- Mr.Hemendra Sahu",
              desc: "Learn how to use mobile and internet responsibly for personal growth.",
              youtube: "https://youtu.be/Vk9yrdgceL0?si=Ooe1LkcHmlJ43DFy",
            },
            {
              image: "/Thumbnails/Vid_2.jpg",
              title: "Education Reform for Bright Future",
              price: "- Mr Deepak Kumar",
              desc: "Explore modern education reforms to build a brighter tomorrow.",
              youtube: "https://youtu.be/-a4mKNXbCNE?si=XB1VZH26hxJJFOpw",
            },
            {
              image: "/Thumbnails/Vid_3.jpg",
              title: "Insomnia Causes and Solution",
              price: "- Mr Suyash Soni",
              desc: "Understand insomnia causes and find practical solutions for better sleep.",
              youtube: "https://youtu.be/2xbR06lgq_4?si=uvMXwU95jjKuJ-CU",
            },
            {
              image: "/Thumbnails/Vid_4.jpg",
              title: "Self Refinement is the Noblest Service to Society",
              price: "- Miss Angana Banerjee",
              desc: "Learn why improving oneself is the ultimate service to the community.",
              youtube: "https://youtu.be/7Ul8Rdeypwc?si=quo9xx2tRIjEQMnq",
            },
            {
              image: "/Thumbnails/Vid_8.jpg",
              title: "Questions in the Journey of Science",
              price: "- Miss Samiksha Dantule",
              desc: "Explore important questions arising on the path of scientific inquiry.",
              youtube: "https://youtu.be/WTgKBcg-9Bc?si=J8bG995sXO7oPkxp",
            },
            {
              image: "/Thumbnails/Vid_9.jpg",
              title: "Education that Builds Humanity",
              price: "- Miss Jagriti Kawde",
              desc: "Discover the principles of education that cultivate human values.",
              youtube: "https://youtu.be/taH-6kfVC7g?si=XGhYBCvB8FgBAaFp",
            },
            {
              image: "/Thumbnails/Vid_10.jpg",
              title: "Stress Free Living",
              price: "- Mr Suyash Soni",
              desc: "Learn practical tips for a calm and stress-free lifestyle.",
              youtube: "https://youtu.be/yvxzqUVac3E?si=QCGBtWwJey6siXAY",
            },
            {
              image: "/Thumbnails/Vid_11.jpg",
              title: "The Vision of Pragya Yog",
              price: "- Mrs Prachi Pawar",
              desc: "Understand the vision and teachings of Pragya Yog for daily life.",
              youtube: "https://youtu.be/JPetb31Pn3s?si=cFxrQtlGRX9LjgsB",
            },
            {
              image: "/Thumbnails/Vid_12.jpg",
              title: "Science of Medicinal Herbs",
              price: "- Dr Vaidehi Puri",
              desc: "Explore the science and benefits of medicinal herbs in daily life.",
              youtube: "https://youtu.be/XAHGcbbGbhI?si=1-IOwBZpFkWSNKoj",
            },
          ];

          const visibleVideos = showAllVideos ? researchVideos : researchVideos.slice(0, 4);

          return (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {visibleVideos.map((tour, index) => (
                  <div
                    key={tour.youtube}
                    className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition flex flex-col"
                  >
                    <div className="relative">
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="font-semibold text-lg text-gray-800 mb-1">
                        {tour.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">{tour.desc}</p>
                      <p className="text-blue-600 font-semibold mb-4">{tour.price}</p>
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

              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAllVideos((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                >
                  {showAllVideos
                    ? "Show Less"
                    : "Show All"}
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
            </>
          );
        })()}
      </section>


    </div>
  );
};

export default Body;
