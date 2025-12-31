import React, { useState, useEffect } from "react";

const GayatriMantra = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Start fading out after 2 seconds
    const fadeTimer = setTimeout(() => {
      setOpacity(0);
    }, 2000);

    // Remove from DOM after fade out completes
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // 2000ms visible + 1000ms fade transition

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      style={{
        opacity: opacity,
        transition: "opacity 1s ease-out",
      }}
    >
      {/* Simple Spinning Loader */}
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default GayatriMantra;

