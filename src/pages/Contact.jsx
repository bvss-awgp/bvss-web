import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-6 py-12 lg:px-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT SIDE */}
        <div>
          <p className="uppercase text-sm text-gray-500 font-semibold mb-2">
            We're here to help you
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            Discuss Your <br />
            <span className="text-blue-600">Chemical Solution</span> Needs
          </h1>
          <p className="text-gray-600 mb-8">
            Are you looking for top-quality chemical solutions tailored to your
            needs? Reach out to us today — we’d love to hear from you.
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12H8m8 0l-8 8m8-8l-8-8"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-700 font-semibold">E-mail</p>
                <p className="text-gray-600">solvent***@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a2 2 0 011.9 1.37l.82 2.45a2 2 0 01-.45 1.96L9.12 10.88a11.05 11.05 0 005 5l2.1-2.1a2 2 0 011.96-.45l2.45.82a2 2 0 011.37 1.9V19a2 2 0 01-2 2h-1a16 16 0 01-13-13V5z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-700 font-semibold">Phone number</p>
                <p className="text-gray-600">+123 - 456 - 7890</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (FORM) */}
        <div className="bg-white shadow-lg rounded-2xl p-8 md:p-10">
          <form className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Jane Smith"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="jane@framer.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Industry
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option>Select...</option>
                <option>Chemical</option>
                <option>Pharmaceutical</option>
                <option>Manufacturing</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Message
              </label>
              <textarea
                rows="4"
                placeholder="Type your message..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex justify-center items-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7-7 7M5 5h16"
                />
              </svg>
              <span>Submit</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
