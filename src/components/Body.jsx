import React from "react";

const Body = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] px-4 bg-gray-50 text-center">
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Welcome to My Website 🚀
        </h1>
        <p className="text-gray-600 text-lg md:text-xl mb-6">
          This is the main content area where you can showcase your app,
          describe your product, or share information with your visitors.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300">
            Get Started
          </button>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300">
            Learn More
          </button>
        </div>
      </div>
    </main>
  );
};

export default Body;
