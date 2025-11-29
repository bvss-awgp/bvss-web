import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { getApiUrl } from "../Config/api";
import useSWR from "swr";

const BlogMagazine = () => {
  const [isVisible, setIsVisible] = useState({
    hero: true,
    categories: true,
    articles: true,
  });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { t } = useLanguage();

  // Build API URL with category filter
  const apiUrl = useMemo(() => {
    const category = selectedCategory === "All" ? null : selectedCategory;
    return getApiUrl(`/blogs${category ? `?category=${encodeURIComponent(category)}` : ''}`);
  }, [selectedCategory]);

  // Fetcher function for SWR
  const fetcher = async (url) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('Blog fetch error:', response.status, errorText);
        const error = new Error("Unable to fetch blogs. Please try again later.");
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      console.log('Blogs fetched successfully:', data.blogs?.length || 0, 'blogs');
      return data.blogs || [];
    } catch (error) {
      console.error('Fetcher error:', error);
      throw error;
    }
  };

  // Use SWR for data fetching with optimized caching
  const {
    data: blogs = [],
    error,
    isLoading: loading,
    mutate,
  } = useSWR(apiUrl, fetcher, {
    revalidateOnFocus: false, // Don't refetch on focus for better performance
    revalidateOnReconnect: true, // Revalidate when network reconnects
    refreshInterval: 0, // Disable auto-refresh for better performance
    errorRetryCount: 2, // Reduce retries
    errorRetryInterval: 3000, // Wait 3 seconds between retries
    dedupingInterval: 5000, // Dedupe requests within 5 seconds
    keepPreviousData: true, // Keep previous data while loading new
    focusThrottleInterval: 60000, // Throttle focus revalidation to 1 minute
  });

  // Intersection Observer for animations - runs after blogs are loaded
  useEffect(() => {
    if (blogs.length === 0) {
      return;
    }

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

    // Small delay to ensure DOM is ready after blogs load
    const timeoutId = setTimeout(() => {
      const elements = document.querySelectorAll("[data-animate]");
      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [blogs.length]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Get read time display
  const getReadTime = (minutes) => {
    if (!minutes) return "5 min read";
    return `${minutes} min read`;
  };

  // Get featured post (first blog in the list)
  const featuredPost = blogs.length > 0 ? blogs[0] : null;
  
  // Get all posts (including featured in the grid)
  const otherPosts = blogs;

  // Get unique categories from blogs
  const categories = ["All"];
  blogs.forEach((blog) => {
    if (blog.category && !categories.includes(blog.category)) {
      categories.push(blog.category);
    }
  });
  
  const getCategoryLabel = (cat) => {
    if (cat === "All") return t("blog.all") || "All";
    return cat;
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    // SWR will automatically refetch when apiUrl changes
  };

  // Loading state
  if (loading && blogs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && blogs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Unable to Load Blogs</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => mutate()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!loading && blogs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Blogs Available</h2>
          <p className="text-gray-600">
            We're working on bringing you insightful content. Please check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen pb-8 sm:pb-12 md:pb-20">
      {/* Hero Section - Featured Post */}
      {featuredPost && (
        <section className="relative h-[50vh] xs:h-[55vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[85vh] overflow-hidden shadow-2xl mt-14 sm:mt-16">
          <div className="absolute inset-0">
            <img
              src={featuredPost.cover_image_url}
              alt={featuredPost.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80";
                e.target.onerror = null;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/40 sm:from-black/80 sm:via-black/50 sm:to-black/30"></div>
          </div>
          <div 
            className="relative h-full flex flex-col justify-end items-start px-4 py-6 xs:px-5 xs:py-7 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 lg:py-12 xl:px-16 xl:py-16 text-white"
            data-animate
            id="hero"
          >
          <div 
            className={`max-w-4xl w-full transform transition-all duration-1000 ${
              isVisible.hero !== false ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="inline-block mb-2 xs:mb-2.5 sm:mb-3 md:mb-4">
              <span className="bg-blue-600/90 backdrop-blur-sm px-2.5 py-1 xs:px-3 xs:py-1.5 sm:px-3.5 sm:py-2 md:px-4 md:py-2 rounded-full text-[10px] xs:text-xs sm:text-sm font-semibold">
                  {featuredPost.category || "Research"}
              </span>
            </div>
            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-2 xs:mb-2.5 sm:mb-3 md:mb-4 lg:mb-6 leading-tight line-clamp-2 sm:line-clamp-none">
              {featuredPost.title}
            </h1>
            <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl mb-3 xs:mb-3.5 sm:mb-4 md:mb-5 lg:mb-6 text-gray-200 max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-3 md:line-clamp-none">
              {featuredPost.excerpt}
            </p>
              <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-4 lg:gap-6 mb-3 xs:mb-3.5 sm:mb-4 md:mb-5 lg:mb-8 text-gray-300 flex-wrap text-[10px] xs:text-xs sm:text-sm">
              <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                <svg className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                  <span className="truncate">{t("blog.by") || "By"} {featuredPost.author || "Research Team"}</span>
              </div>
              <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                <svg className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                  <span className="truncate">{formatDate(featuredPost.published_date)}</span>
              </div>
              <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                <svg className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                  <span>{getReadTime(featuredPost.read_time_minutes)}</span>
                </div>
              </div>
              <Link
                to={`/blog/${featuredPost.slug}`}
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 xs:px-4 xs:py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-4 rounded-full font-semibold text-xs xs:text-sm sm:text-base md:text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform"
              >
                {t("common.readMore") || "Read More"}
              </Link>
          </div>
        </div>
      </section>
      )}

      {/* Categories Filter */}
      <section 
        className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 mt-6 xs:mt-8 sm:mt-10 md:mt-12"
        data-animate
        id="categories"
      >
        <div 
          className={`flex flex-wrap justify-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-4 transform transition-all duration-700 ${
            isVisible.categories !== false ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {categories.map((category, idx) => (
            <button
              key={idx}
              onClick={() => handleCategoryClick(category)}
              className={`px-3 py-1.5 xs:px-4 xs:py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-full text-xs xs:text-sm sm:text-base font-semibold transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transform ${
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
        className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 mt-8 xs:mt-10 sm:mt-12 md:mt-16"
        data-animate
        id="articles-section"
      >
        <h2 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 xs:mb-8 sm:mb-10 md:mb-12 text-center px-2">
          {t("blog.latestArticles") || "Latest Articles"}
        </h2>
        {loading && blogs.length > 0 && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-5 w-5 xs:h-6 xs:w-6 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-2 text-xs xs:text-sm">Refreshing...</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {otherPosts.length === 0 ? (
            <div className="col-span-full text-center py-8 xs:py-10 sm:py-12">
              <p className="text-gray-500 text-base xs:text-lg sm:text-xl">No articles found in this category.</p>
            </div>
          ) : (
            otherPosts.map((post, idx) => (
            <article
              key={post.id || post.slug}
              className="bg-white rounded-xl xs:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-[1.02] sm:hover:scale-105 hover:-translate-y-1 sm:hover:-translate-y-2 group opacity-100"
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              <Link to={`/blog/${post.slug}`} className="block h-full">
              <div className="relative overflow-hidden">
                <img
                    src={post.cover_image_url}
                  alt={post.title}
                  className="w-full h-48 xs:h-56 sm:h-60 md:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80";
                    e.target.onerror = null;
                  }}
                />
                <div className="absolute top-2 xs:top-3 sm:top-4 left-2 xs:left-3 sm:left-4">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 py-0.5 xs:px-2.5 xs:py-1 sm:px-3 sm:py-1 rounded-full text-[10px] xs:text-xs font-semibold backdrop-blur-sm">
                      {post.category || "Research"}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-4 xs:p-5 sm:p-6">
                <h3 className="text-base xs:text-lg sm:text-xl font-bold text-gray-800 mb-2 xs:mb-2.5 sm:mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-xs xs:text-sm mb-3 xs:mb-3.5 sm:mb-4 line-clamp-2 xs:line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-[10px] xs:text-xs text-gray-500 mb-2 xs:mb-2.5 sm:mb-3 md:mb-4 flex-wrap gap-1 xs:gap-1.5">
                  <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                    <svg className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                      <span className="truncate">{t("blog.by") || "By"} {post.author || "Research Team"}</span>
                    </div>
                    <span className="whitespace-nowrap">{getReadTime(post.read_time_minutes)}</span>
                  </div>
                  <div className="text-[10px] xs:text-xs text-gray-400 mb-3 xs:mb-3.5 sm:mb-4">{formatDate(post.published_date)}</div>
                  <div className="mt-3 xs:mt-4 w-full bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-600 hover:to-indigo-600 text-gray-700 hover:text-white px-3 py-1.5 xs:px-4 xs:py-2 sm:px-4 sm:py-2 rounded-lg text-xs xs:text-sm font-semibold transition-all duration-300 text-center">
                    {t("blog.readMore") || "Read More"} →
                  </div>
                </div>
              </Link>
            </article>
            ))
          )}
        </div>
      </section>

    </div>
  );
};

export default BlogMagazine;
