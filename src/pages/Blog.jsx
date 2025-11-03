import React, { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const BlogMagazine = () => {
  const [isVisible, setIsVisible] = useState({});
  const [email, setEmail] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
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

  const posts = [
    {
      id: 1,
      title: "The Harmony Between Science and Spirituality",
      excerpt:
        "Exploring how ancient wisdom aligns with modern discoveries — bridging logic, meditation, and consciousness.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
      author: "Param Pujya Gurudev",
      date: "October 25, 2025",
      category: "Research",
      featured: true,
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "Mind Over Media: Reducing Screen Time for Mental Clarity",
      excerpt:
        "Discover mindful approaches to balance digital life and inner peace through practical self-discipline.",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80",
      author: "Suyash Soni",
      date: "October 18, 2025",
      category: "Wellness",
      readTime: "4 min read",
    },
    {
      id: 3,
      title: "The Cognitive Science Behind Chanting",
      excerpt:
        "Studies show chanting enhances attention, emotional regulation, and synchrony among practitioners.",
      image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&q=80",
      author: "Dr. Vaidehi Puri",
      date: "October 10, 2025",
      category: "Science",
      readTime: "6 min read",
    },
    {
      id: 4,
      title: "Living Consciously in a Distracted World",
      excerpt:
        "How awareness training and focused presence can transform how we think, act, and connect with others.",
      image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&q=80",
      author: "Prof. Jagriti Kawde",
      date: "September 29, 2025",
      category: "Mindfulness",
      readTime: "5 min read",
    },
    {
      id: 5,
      title: "From Rituals to Research: The Future of Mind Training",
      excerpt:
        "An evolving dialogue between ancient practices and neuroscience offers new insights into wellbeing.",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80",
      author: "Research Team",
      date: "September 15, 2025",
      category: "Research",
      readTime: "7 min read",
    },
    {
      id: 6,
      title: "Education Reform Through Spiritual Principles",
      excerpt:
        "Integrating character development with academic excellence to create holistic educational experiences.",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80",
      author: "Research Team",
      date: "September 5, 2025",
      category: "Education",
      readTime: "5 min read",
    },
  ];

  const featuredPost = posts.find((p) => p.featured);
  
  // Filter posts based on selected category
  const filteredPosts = selectedCategory === "All" 
    ? posts.filter((p) => !p.featured)
    : posts.filter((p) => !p.featured && p.category === selectedCategory);

  const categories = ["All", "Research", "Wellness", "Science", "Mindfulness", "Education"];
  
  const getCategoryLabel = (cat) => {
    if (cat === "All") return t("blog.all");
    return cat; // Categories stay in English as they are research-focused
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert("Thank you for subscribing! We'll keep you updated with our latest insights.");
      setEmail("");
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative h-[75vh] overflow-hidden rounded-b-3xl shadow-2xl">
        <div className="absolute inset-0">
          <img
            src={featuredPost.image}
            alt={featuredPost.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80";
              e.target.onerror = null;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
        </div>
        <div 
          className="relative h-full flex flex-col justify-end p-8 md:p-12 text-white"
          data-animate
          id="hero"
        >
          <div 
            className={`max-w-4xl transform transition-all duration-1000 ${
              isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="inline-block mb-4">
              <span className="bg-blue-600/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                {featuredPost.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              {featuredPost.title}
            </h1>
            <p className="text-lg md:text-xl mb-6 text-gray-200 max-w-2xl leading-relaxed">
              {featuredPost.excerpt}
            </p>
            <div className="flex items-center gap-6 mb-8 text-gray-300">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>{t("blog.by")} {featuredPost.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>{featuredPost.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>{featuredPost.readTime}</span>
              </div>
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform">
              {t("common.readMore")}
            </button>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section 
        className="max-w-7xl mx-auto px-6 mt-12"
        data-animate
        id="categories"
      >
        <div 
          className={`flex flex-wrap justify-center gap-4 transform transition-all duration-700 ${
            isVisible.categories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {categories.map((category, idx) => (
            <button
              key={idx}
              onClick={() => handleCategoryClick(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-xl hover:scale-110 transform ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white"
              }`}
            >
              {getCategoryLabel(category)}
            </button>
          ))}
        </div>
      </section>

      {/* Grid of Secondary Articles */}
      <section 
        className="max-w-7xl mx-auto px-6 mt-16"
        data-animate
        id="articles"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">
          {t("blog.latestArticles")}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No articles found in this category.</p>
            </div>
          ) : (
            filteredPosts.map((post, idx) => (
            <article
              key={post.id}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2 group ${
                isVisible.articles ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80";
                    e.target.onerror = null;
                  }}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                    {post.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span>{t("blog.by")} {post.author}</span>
                  </div>
                  <span>{post.readTime}</span>
                </div>
                <div className="text-xs text-gray-400">{post.date}</div>
                <button className="mt-4 w-full bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-600 hover:to-indigo-600 text-gray-700 hover:text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300">
                  {t("blog.readMore")} →
                </button>
              </div>
            </article>
            ))
          )}
        </div>
      </section>

      {/* Newsletter / Call to Action */}
      <section 
        className="mt-24 max-w-5xl mx-auto px-6"
        data-animate
        id="newsletter"
      >
        <div 
          className={`bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden transform transition-all duration-700 ${
            isVisible.newsletter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <div className="text-6xl mb-6">📬</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t("blog.stayInspired")}</h2>
            <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-2xl mx-auto leading-relaxed">
              {t("blog.subscribeText")}
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <input
                type="email"
                placeholder={t("blog.enterEmail")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-6 py-4 rounded-full text-gray-800 w-full sm:flex-1 text-lg focus:outline-none focus:ring-4 focus:ring-white/50 transition-all placeholder:text-blue-200 placeholder:font-light"
                required
              />
              <button 
                type="submit"
                className="bg-white text-indigo-600 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform text-lg whitespace-nowrap"
              >
                {t("blog.subscribe")}
              </button>
            </form>
            <p className="mt-6 text-sm text-blue-200">
              {t("blog.privacy")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogMagazine;
