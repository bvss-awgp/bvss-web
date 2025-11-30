import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { getApiUrl } from "../Config/api";
import useSWR from "swr";

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { token, isAuthenticated } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [likeError, setLikeError] = useState("");

  // Fetcher function for SWR with auth token
  const fetcher = async (url) => {
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const error = new Error("Unable to fetch blog post.");
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    return data.blog;
  };

  // Use SWR for data fetching with optimized caching
  const {
    data: blog,
    error,
    isLoading,
    mutate,
  } = useSWR(slug ? getApiUrl(`/blogs/${slug}`) : null, fetcher, {
    revalidateOnFocus: false, // Don't refetch on focus for better performance
    revalidateOnReconnect: true, // Revalidate when network reconnects
    refreshInterval: 0, // Disable auto-refresh for better performance
    errorRetryCount: 2, // Reduce retries
    errorRetryInterval: 3000, // Wait 3 seconds between retries
    dedupingInterval: 5000, // Dedupe requests within 5 seconds
    keepPreviousData: true, // Keep previous data while loading new
  });

  // Fetch comments
  const commentsFetcher = async (url) => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return { comments: [], pagination: {} };
    }

    const data = await response.json();
    return data;
  };

  const {
    data: commentsData,
    mutate: mutateComments,
  } = useSWR(
    slug ? getApiUrl(`/blogs/${slug}/comments`) : null,
    commentsFetcher,
    {
      revalidateOnFocus: false, // Don't refetch on focus for better performance
      refreshInterval: 0, // Disable auto-refresh - manual refresh via mutate
      dedupingInterval: 5000, // Dedupe requests
      keepPreviousData: true, // Keep previous data while loading new
    }
  );

  // Handle like/unlike
  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate("/signin", { state: { from: `/blog/${slug}` } });
      return;
    }

    if (!token) {
      console.error("No authentication token available");
      setLikeError("Authentication required. Please sign in again.");
      navigate("/signin", { state: { from: `/blog/${slug}` } });
      return;
    }

    setIsLiking(true);
    setLikeError("");

    try {
      const method = blog?.userLiked ? "DELETE" : "POST";
      const url = getApiUrl(`/blogs/${slug}/like`);
      
      console.log(`🔄 ${method} ${url}`);
      console.log('Blog userLiked:', blog?.userLiked);
      console.log('Token present:', !!token);
      
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      console.log('Response status:', response.status, response.statusText);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorData;
        try {
          const text = await response.text();
          console.log('Error response text:', text);
          errorData = text ? JSON.parse(text) : { message: "Failed to like/unlike blog" };
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
          errorData = { message: `Server error: ${response.status} ${response.statusText}` };
        }
        console.error("Like error response:", errorData);
        
        // If we get 400 "already liked" when trying to POST, it means the state was out of sync
        // Refresh the blog data to get the correct state
        if (response.status === 400 && (errorData.code === 'ALREADY_LIKED' || (errorData.message && errorData.message.includes('already liked')))) {
          console.log('🔄 State mismatch detected - refreshing blog data');
          await mutate();
          setLikeError(""); // Clear error since we're fixing it
          return; // Exit early, state is now correct
        }
        
        // If we get 404 "Like not found" when trying to DELETE, also refresh
        if (response.status === 404 && errorData.message && errorData.message.includes('Like not found')) {
          console.log('🔄 Like not found - refreshing blog data');
          await mutate();
          setLikeError(""); // Clear error since we're fixing it
          return; // Exit early, state is now correct
        }
        
        throw new Error(errorData.message || "Failed to like/unlike blog");
      }

      const data = await response.json().catch(() => ({}));
      console.log('Like success:', data);

      // Refresh blog data to get updated like count
      await mutate();
      setLikeError("");
    } catch (error) {
      console.error("Like error:", error);
      setLikeError(error.message || "Failed to like/unlike blog. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  // Handle comment submission
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/signin", { state: { from: `/blog/${slug}` } });
      return;
    }

    if (!commentText.trim()) {
      setCommentError("Please enter a comment.");
      return;
    }

    setIsSubmittingComment(true);
    setCommentError("");

    try {
      const response = await fetch(getApiUrl(`/blogs/${slug}/comments`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentText.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to post comment");
      }

      // Clear form and refresh comments
      setCommentText("");
      mutateComments();
      mutate(); // Also refresh blog to update comment count
    } catch (error) {
      console.error("Comment error:", error);
      setCommentError(error.message || "Failed to post comment. Please try again.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

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

  const getReadTime = (minutes) => {
    if (!minutes) return "5 min read";
    return `${minutes} min read`;
  };

  // Render content with HTML (if content contains HTML)
  const renderContent = (content) => {
    if (!content) return "";
    // Check if content contains HTML tags
    if (/<[a-z][\s\S]*>/i.test(content)) {
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: content }} 
          className="prose prose-lg max-w-none"
          style={{
            fontFamily: '"Georgia", "Times New Roman", serif',
          }}
        />
      );
    }
    // If plain text, render with line breaks and better paragraph spacing
    return content.split("\n\n").map((paragraph, idx) => {
      // Skip empty paragraphs
      const trimmed = paragraph.trim();
      if (!trimmed) return null;
      
      return (
        <p 
          key={idx} 
          className="mb-6 last:mb-0"
          style={{
            textIndent: '0',
            lineHeight: '1.85',
          }}
        >
          {trimmed.split("\n").map((line, lineIdx) => (
            <React.Fragment key={lineIdx}>
              {line}
              {lineIdx < paragraph.split("\n").length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      );
    }).filter(Boolean);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#6b5b47] mb-4"></div>
          <p className="text-[#6b5b47]">Loading blog post...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center pt-16 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-[#2c2416] mb-4">
            Blog Post Not Found
          </h2>
          <p className="text-[#6b5b47] mb-6">
            {error.status === 404
              ? "The blog post you're looking for doesn't exist or has been removed."
              : "Unable to load the blog post. Please try again later."}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => mutate()}
              className="bg-[#8b7355] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#6b5b47] transition"
            >
              Try Again
            </button>
            <Link
              to="/blog"
              className="bg-[#6b5b47] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5a4a3a] transition"
            >
              Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <div className="bg-[#f5f1e8] min-h-screen">
      {/* Hero Section with Cover Image */}
      <section className="relative h-[50vh] sm:h-[55vh] md:h-[70vh] lg:h-[75vh] overflow-hidden mt-16">
        <div className="absolute inset-0">
          <img
            src={blog.cover_image_url}
            alt={blog.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80";
              e.target.onerror = null;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50"></div>
        </div>
        <div className="relative h-full flex flex-col justify-end p-4 sm:p-6 md:p-8 lg:p-12 text-white">
          <div className="max-w-4xl mx-auto w-full">
            <div className="inline-block mb-2 sm:mb-4">
              <span className="bg-blue-600/90 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                {blog.category || "Research"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold mb-3 sm:mb-4 md:mb-6 leading-tight">
              {blog.title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-3 sm:mb-4 md:mb-6 text-gray-200 max-w-2xl leading-relaxed">
              {blog.excerpt}
            </p>
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8 text-gray-300 flex-wrap text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  {t("blog.by") || "By"} {blog.author || "Research Team"}
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{formatDate(blog.published_date)}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{getReadTime(blog.read_time_minutes)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-[#6b5b47] hover:text-[#8b7355] mb-6 md:mb-8 transition-colors font-medium"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>
            Back to Blogs
          </span>
        </Link>

        {/* Blog Content - E-book Style */}
        <div className="bg-[#fefcf9] rounded-lg shadow-2xl border border-[#e8ddd4] p-6 sm:p-8 md:p-12 lg:p-16 mb-8">
          {/* Paper texture effect */}
          <div 
            className="max-w-2xl mx-auto"
            style={{
              fontFamily: '"Georgia", "Times New Roman", serif',
            }}
          >
            <div 
              className="text-[#2c2416] leading-[1.8] text-[18px] sm:text-[19px] md:text-[20px]"
              style={{
                lineHeight: '1.85',
                letterSpacing: '0.01em',
              }}
            >
              {renderContent(blog.content)}
            </div>
          </div>
        </div>

        {/* Like Button Section */}
        <div className="mt-8 bg-[#fefcf9] rounded-lg shadow-lg border border-[#e8ddd4] p-6">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              blog.userLiked
                ? "bg-red-600 text-white hover:bg-red-700 shadow-md"
                : "bg-[#e8ddd4] text-[#6b5b47] hover:bg-[#d4c5b0]"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLiking ? (
              <>
                <svg
                  className="animate-spin h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <svg
                  className={`w-6 h-6 ${blog.userLiked ? "fill-current" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>
                  {blog.userLiked ? "Liked" : "Like"} ({blog.likeCount || 0})
                </span>
              </>
            )}
          </button>
          {likeError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{likeError}</p>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="mt-8 bg-[#fefcf9] rounded-lg shadow-xl border border-[#e8ddd4] p-6 sm:p-8 md:p-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2c2416] mb-6" style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}>
            Comments ({blog.commentCount || 0})
          </h2>

          {/* Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <textarea
                value={commentText}
                onChange={(e) => {
                  setCommentText(e.target.value);
                  setCommentError("");
                }}
                placeholder="Write your comment..."
                rows="4"
                maxLength={1000}
                className="w-full px-4 py-3 border-2 border-[#e8ddd4] bg-white rounded-lg focus:ring-2 focus:ring-[#8b7355] focus:border-[#8b7355] outline-none transition resize-none text-[#2c2416] placeholder:text-[#9b8a7a]"
                style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}
              />
              {commentError && (
                <p className="text-red-700 text-sm mt-2">{commentError}</p>
              )}
              <button
                type="submit"
                disabled={isSubmittingComment || !commentText.trim()}
                className="mt-4 bg-[#8b7355] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#6b5b47] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isSubmittingComment ? "Posting..." : "Post Comment"}
              </button>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-[#f0ebe0] rounded-lg text-center border border-[#e8ddd4]">
              <p className="text-[#6b5b47] mb-3">
                Please{" "}
                <Link
                  to="/signin"
                  state={{ from: `/blog/${slug}` }}
                  className="text-[#8b7355] font-semibold hover:underline"
                >
                  sign in
                </Link>{" "}
                to comment.
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {commentsData?.comments?.length > 0 ? (
              commentsData.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border-b border-[#e8ddd4] pb-6 last:border-0"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b7355] to-[#6b5b47] flex items-center justify-center text-white font-bold shadow-md">
                      {comment.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-semibold text-[#2c2416]" style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}>
                          {comment.userName}
                        </h3>
                        <span className="text-sm text-[#9b8a7a]">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-[#2c2416] leading-relaxed" style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}>
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#9b8a7a] text-center py-8" style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}>
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>

        {/* Share Section */}
        <div className="mt-12 bg-[#fefcf9] rounded-lg shadow-xl border border-[#e8ddd4] p-6 sm:p-8 text-center">
          <h3 className="text-2xl font-bold text-[#2c2416] mb-4" style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}>
            Share This Article
          </h3>
          <p className="text-[#6b5b47] mb-6" style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}>
            Found this article helpful? Share it with others on social media!
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {/* Facebook Share */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </a>
            
            {/* Twitter Share */}
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sky-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-sky-600 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Twitter
            </a>
            
            {/* WhatsApp Share */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(blog.title + ' ' + window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </a>
            
            {/* LinkedIn Share */}
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-800 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
            
            {/* Copy Link */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }}
              className="bg-gray-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-700 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Link
            </button>
          </div>
        </div>
      </article>

    </div>
  );
};

export default BlogDetail;
