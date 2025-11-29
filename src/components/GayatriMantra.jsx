import React, { useState, useEffect } from "react";

const GayatriMantra = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Start fading out after 3 seconds
    const fadeTimer = setTimeout(() => {
      setOpacity(0);
    }, 1000);

    // Remove from DOM after fade out completes
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2000); // 3000ms fade + 1000ms transition

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/40 backdrop-blur-sm"
      style={{
        opacity: opacity,
        transition: "opacity 1s ease-out",
      }}
    >
      <div className="relative">
        {/* Glowing background effect */}
        <div className="absolute inset-0 -z-20 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-indigo-600/30 blur-3xl rounded-full animate-pulse-scale scale-150"></div>
        
        {/* Main Mantra Text */}
        <div className="text-center relative z-10">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-[0_0_20px_rgba(59,130,246,0.8)] animate-float-mantra px-6">
            <span className="block mb-2">ॐ भूर्भुवः स्वः</span>
            <span className="block mb-2">तत्सवितुर्वरेण्यं</span>
            <span className="block mb-2">भर्गो देवस्य धीमहि</span>
            <span className="block">धियो यो नः प्रचोदयात्</span>
          </h1>
        </div>

        {/* Floating particles/effects */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-white/40 rounded-full animate-pulse"
              style={{
                left: `${15 + (i % 4) * 20}%`,
                top: `${25 + Math.floor(i / 4) * 50}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${2 + (i % 3) * 0.5}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GayatriMantra;

