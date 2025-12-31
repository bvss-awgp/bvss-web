import React, { useState, useEffect } from "react";

const GayatriMantra = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Start fading out after 1 second
    const fadeTimer = setTimeout(() => {
      setOpacity(0);
    }, 1000);

    // Remove from DOM after fade out completes
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2000); // 1000ms fade + 1000ms transition

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
      {/* Simple Spinning Loader */}
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default GayatriMantra;

