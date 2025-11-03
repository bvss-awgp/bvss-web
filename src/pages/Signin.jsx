import React, { useState } from "react";
import { Link } from "react-router-dom";

const Signin = () => {
  const [isSignUp, setIsSignUp] = useState(false); // state to toggle forms

  return (
    <div className="flex h-screen">
      {/* Left Side */}
      <div className="w-1/2 flex items-center justify-center bg-gradient-to-br from-purple-500 via-purple-400 to-orange-300 text-white">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">
            {isSignUp ? "Join Us!" : "Welcome Back!"}
          </h1>
          <p className="text-lg opacity-90">
            {isSignUp
              ? "Create your account to get started."
              : "We’re happy to see you again."}
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex flex-col justify-center px-16 bg-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2 text-gray-800">
          {isSignUp ? "Sign Up" : "Login"}
        </h2>
        <p className="text-gray-500 mb-8">
          {isSignUp
            ? "Please fill in your details to create an account."
            : "Welcome back! Please login to your account."}
        </p>

        <form className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="username@gmail.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          )}

          {!isSignUp && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox text-purple-500" />
                <span className="text-gray-700">Remember Me</span>
              </label>
              <a href="#" className="text-purple-500 hover:underline">
                Forgot Password?
              </a>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition"
          >
            {isSignUp ? "Sign Up" : "Login"}
          </button>

          {isSignUp && (
            <div className="text-center">
              <Link
                to="/contribute"
                className="inline-block w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-2 rounded-lg transition shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Join as Volunteer
              </Link>
            </div>
          )}

          <p className="text-center text-gray-600 text-sm">
            {isSignUp ? "Already have an account?" : "New User?"}{" "}
            <span
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-purple-500 font-medium hover:underline cursor-pointer"
            >
              {isSignUp ? "Login" : "Sign Up"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signin;
