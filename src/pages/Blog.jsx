import React from "react";

const BlogMagazine = () => {
  const posts = [
    {
      id: 1,
      title: "The Harmony Between Science and Spirituality",
      excerpt:
        "Exploring how ancient wisdom aligns with modern discoveries — bridging logic, meditation, and consciousness.",
      image: "/blog/spirituality.jpg",
      author: "Dr. Vivek Bhagel",
      date: "October 25, 2025",
      featured: true,
    },
    {
      id: 2,
      title: "Mind Over Media: Reducing Screen Time for Mental Clarity",
      excerpt:
        "Discover mindful approaches to balance digital life and inner peace through practical self-discipline.",
      image: "/blog/screentime.jpg",
      author: "Suyash Soni",
      date: "October 18, 2025",
    },
    {
      id: 3,
      title: "The Cognitive Science Behind Chanting",
      excerpt:
        "Studies show chanting enhances attention, emotional regulation, and synchrony among practitioners.",
      image: "/blog/chanting.jpg",
      author: "Dr. Vaidehi Puri",
      date: "October 10, 2025",
    },
    {
      id: 4,
      title: "Living Consciously in a Distracted World",
      excerpt:
        "How awareness training and focused presence can transform how we think, act, and connect with others.",
      image: "/blog/conscious.jpg",
      author: "Prof. Jagriti Kawde",
      date: "September 29, 2025",
    },
    {
      id: 5,
      title: "From Rituals to Research: The Future of Mind Training",
      excerpt:
        "An evolving dialogue between ancient practices and neuroscience offers new insights into wellbeing.",
      image: "/blog/mindtraining.jpg",
      author: "Research Team",
      date: "September 15, 2025",
    },
  ];

  const featuredPost = posts.find((p) => p.featured);
  const otherPosts = posts.filter((p) => !p.featured);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden rounded-b-3xl shadow-md">
        <img
          src={featuredPost.image}
          alt={featuredPost.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-10 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-2xl">
            {featuredPost.title}
          </h1>
          <p className="max-w-xl text-lg mb-4">{featuredPost.excerpt}</p>
          <div className="text-sm opacity-80">
            By {featuredPost.author} • {featuredPost.date}
          </div>
          <button className="mt-6 bg-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition w-fit">
            Read Full Story
          </button>
        </div>
      </section>

      {/* Grid of Secondary Articles */}
      <section className="max-w-7xl mx-auto px-6 mt-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          Latest Articles
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {otherPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-52 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 transition">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>By {post.author}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter / Call to Action */}
      <section className="mt-20 max-w-4xl mx-auto bg-blue-600 text-white rounded-2xl p-10 text-center shadow-lg">
        <h2 className="text-3xl font-bold mb-4">Stay Inspired</h2>
        <p className="mb-6">
          Get notified when we publish new research, reflections, or spiritual insights.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 rounded-lg text-gray-800 w-full sm:w-2/3"
          />
          <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
};

export default BlogMagazine;
