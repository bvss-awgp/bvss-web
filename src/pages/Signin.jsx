import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getApiUrl } from "../Config/api";

const Signin = () => {
  const [isSignUp, setIsSignUp] = useState(false); // state to toggle forms
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupConsent, setSignupConsent] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  // Password validation function
  const validatePassword = (password) => {
    if (!password || typeof password !== "string") {
      return { valid: false, message: "Password is required." };
    }

    if (password.length < 8) {
      return { valid: false, message: "Password must be at least 8 characters long." };
    }

    // Check if password contains only digits
    if (/^\d+$/.test(password)) {
      return {
        valid: false,
        message: "Password cannot contain only digits. Please use a combination of letters, numbers, and special characters.",
      };
    }

    // Check if password contains at least one letter
    if (!/[a-zA-Z]/.test(password)) {
      return { valid: false, message: "Password must contain at least one letter." };
    }

    // Check if password contains at least one number
    if (!/\d/.test(password)) {
      return { valid: false, message: "Password must contain at least one number." };
    }

    return { valid: true };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (isSignUp) {
      if (!name) {
        setError("Please enter your name.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      // Validate password
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        setError(passwordValidation.message);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (isSignUp) {
        // Call OTP send endpoint
        const apiUrl = getApiUrl("/otp/send");
        const requestBody = {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: password,
        };
        
        console.log('🚀 Sending OTP request to:', apiUrl);
        console.log('📦 Request body:', { ...requestBody, password: '***' });
        
        try {
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(requestBody),
          });
          
          console.log('📨 Response received - Status:', response.status, response.statusText);
          console.log('📨 Response headers:', Object.fromEntries(response.headers.entries()));
          
          if (!response.ok) {
            console.error('❌ Response not OK:', response.status, response.statusText);
          }

          // Parse response - can only read body once
          let data;
          try {
            const text = await response.text();
            console.log('📨 Response text:', text);
            if (text) {
              try {
                data = JSON.parse(text);
                console.log('✅ Parsed response data:', data);
              } catch (parseError) {
                console.error("❌ Error parsing JSON:", parseError);
                data = {
                  message: text || "Invalid response from server. Please try again.",
                };
              }
            } else {
              console.warn('⚠️ Empty response body');
              data = {};
            }
          } catch (parseError) {
            console.error("❌ Error reading response:", parseError);
            data = {
              message: "Invalid response from server. Please try again.",
            };
          }

          if (!response.ok) {
            const errorMessage = data?.message || "Unable to send verification code. Please try again.";
            console.error('❌ Request failed:', errorMessage);
            
            // Check for specific error codes
            if (response.status === 409) {
              throw new Error("User already exists with this email address.");
            }
            
            throw new Error(errorMessage);
          }

          // Store email and sessionId for OTP verification page
          const sessionId = data.sessionId || "";
          console.log('✅ OTP sent successfully. Session ID:', sessionId);
          sessionStorage.setItem("otp_email", email.toLowerCase().trim());
          sessionStorage.setItem("otp_sessionId", sessionId);

          // Navigate to OTP verification page
          navigate("/otp-verify", {
            replace: true,
            state: {
              email: email.toLowerCase().trim(),
              sessionId: sessionId,
            },
          });
        } catch (fetchError) {
          console.error('❌ Fetch error:', fetchError);
          throw fetchError;
        }
      } else {
        await login({ email, password, rememberMe });
        navigate(from, { replace: true });
      }
    } catch (authError) {
      // Handle different types of errors
      if (authError instanceof SyntaxError) {
        setError("Server error: Invalid response. Please try again.");
        console.error("JSON parse error:", authError);
      } else if (authError instanceof TypeError) {
        setError("Network error. Please check your connection and try again.");
        console.error("Network error:", authError);
      } else {
        setError(authError?.message || "Unable to complete the request. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleMode = () => {
    setIsSignUp((prev) => !prev);
    setError("");
    setName("");
    setConfirmPassword("");
    setSignupConsent(false);
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left Side */}
      <div className="relative flex w-full items-center justify-center px-6 pt-28 pb-12 sm:px-10 sm:pt-32 lg:w-1/2 lg:py-16 lg:pt-0 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/Brahmvarchasv.jpg')" }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-md text-center text-white">
          <h1 className="text-4xl font-bold sm:text-5xl mb-4 drop-shadow-lg">
            {isSignUp ? "Join Us!" : "Welcome Back!"}
          </h1>
          <p className="text-base opacity-90 sm:text-lg drop-shadow-md">
            {isSignUp
              ? "Create your account to get started."
              : "We're happy to see you again."}
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="mt-10 flex w-full flex-col justify-center bg-white px-6 py-10 shadow-lg sm:mt-12 sm:px-10 lg:mt-0 lg:w-1/2 lg:px-16">
        <h2 className="mb-2 text-2xl font-semibold text-gray-800 sm:text-3xl">
          {isSignUp ? "Sign Up" : "Login"}
        </h2>
        <p className="mb-6 text-sm text-gray-500 sm:mb-8 sm:text-base">
          {isSignUp
            ? "Please fill in your details to create an account."
            : "Welcome back! Please login to your account."}
        </p>

        <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
          {isSignUp && (
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="username@gmail.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>
          )}

          {isSignUp ? (
            <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
              <input
                id="signup-consent"
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-500 focus:ring-purple-400"
                checked={signupConsent}
                onChange={(event) => setSignupConsent(event.target.checked)}
              />
              <label htmlFor="signup-consent" className="text-gray-700">
                I agree to contribute authentically and follow the Brahmarishi Vishwamitra Research Center community
                guidelines while participating in the research program.
              </label>
            </div>
          ) : (
            <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox text-purple-500"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                <span className="text-gray-700">Remember Me</span>
              </label>
              <a href="#" className="text-purple-500 hover:underline">
                Forgot Password?
              </a>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSubmitting || (isSignUp && !signupConsent)}
          >
            {isSubmitting
              ? isSignUp
                ? "Signing Up..."
                : "Logging In..."
              : isSignUp
              ? "Sign Up"
              : "Login"}
          </button>

          <p className="text-center text-sm text-gray-600">
            {isSignUp ? "Already have an account?" : "New User?"}{" "}
            <span
              onClick={handleToggleMode}
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
