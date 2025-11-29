import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getApiUrl } from "../Config/api";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get email and sessionId from location state or sessionStorage
    const stateEmail = location.state?.email;
    const stateSessionId = location.state?.sessionId;
    
    if (stateEmail && stateSessionId) {
      setEmail(stateEmail);
      setSessionId(stateSessionId);
      sessionStorage.setItem("otp_email", stateEmail);
      sessionStorage.setItem("otp_sessionId", stateSessionId);
    } else {
      // Try to get from sessionStorage
      const storedEmail = sessionStorage.getItem("otp_email");
      const storedSessionId = sessionStorage.getItem("otp_sessionId");
      if (storedEmail && storedSessionId) {
        setEmail(storedEmail);
        setSessionId(storedSessionId);
      } else {
        // No email/sessionId found, redirect to signup
        navigate("/signin", { replace: true });
      }
    }
  }, [location, navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    setError("");
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    if (!email || !sessionId) {
      setError("Session expired. Please start the signup process again.");
      navigate("/signin", { replace: true });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(getApiUrl("/otp/verify"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email,
          otp: otp,
          sessionId: sessionId,
        }),
      });

      // Check content type before parsing JSON
      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          data = {
            message: text || "Invalid OTP. Please try again.",
          };
        }
      }

      if (!response.ok) {
        const errorMessage = data?.message || "Invalid OTP. Please try again.";
        
        if (response.status === 409) {
          throw new Error("User already exists with this email address.");
        }
        
        throw new Error(errorMessage);
      }

      // OTP verified successfully, user account created
      // Set auth state manually since we got token and user
      if (data.token && data.user) {
        // Set auth state in localStorage
        localStorage.setItem(
          "bvss-auth",
          JSON.stringify({
            token: data.token,
            user: data.user,
          })
        );
        
        // Clear session storage
        sessionStorage.removeItem("otp_email");
        sessionStorage.removeItem("otp_sessionId");
        
        // Reload page to update auth context
        window.location.href = "/";
      }
    } catch (err) {
      setError(err.message || "Failed to verify OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || !email || !sessionId) {
      return;
    }

    setIsResending(true);
    setError("");

    try {
      const response = await fetch(getApiUrl("/otp/resend"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email,
          sessionId: sessionId,
        }),
      });

      // Check content type before parsing JSON
      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          data = {
            message: text || "Failed to resend OTP. Please try again.",
          };
        }
      }

      if (!response.ok) {
        throw new Error(data?.message || "Failed to resend OTP. Please try again.");
      }

      // Reset timer
      setTimeLeft(180);
      setCanResend(false);
      setOtp("");
      setError("");
    } catch (err) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
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
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-md text-center text-white">
          <h1 className="text-4xl font-bold sm:text-5xl mb-4 drop-shadow-lg">
            Verify Your Email
          </h1>
          <p className="text-base opacity-90 sm:text-lg drop-shadow-md">
            We've sent a verification code to your email address.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="mt-10 flex w-full flex-col justify-center bg-white px-6 py-10 shadow-lg sm:mt-12 sm:px-10 lg:mt-0 lg:w-1/2 lg:px-16">
        <h2 className="mb-2 text-2xl font-semibold text-gray-800 sm:text-3xl">
          Enter Verification Code
        </h2>
        <p className="mb-6 text-sm text-gray-500 sm:mb-8 sm:text-base">
          Please enter the 6-digit code sent to <strong>{email}</strong>
        </p>

        <form className="space-y-5 sm:space-y-6" onSubmit={handleVerify}>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Verification Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="000000"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={otp}
              onChange={handleOTPChange}
              maxLength={6}
              autoFocus
            />
          </div>

          {/* Timer */}
          <div className="text-center">
            {timeLeft > 0 ? (
              <p className="text-sm text-gray-600">
                Code expires in: <span className="font-semibold text-purple-600">{formatTime(timeLeft)}</span>
              </p>
            ) : (
              <p className="text-sm text-red-600 font-medium">
                Code has expired. Please request a new one.
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSubmitting || otp.length !== 6}
          >
            {isSubmitting ? "Verifying..." : "Verify Email"}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={!canResend || isResending}
              className="text-purple-500 font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Wrong email?{" "}
              <Link to="/signin" className="text-purple-500 font-medium hover:underline">
                Start Over
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;

