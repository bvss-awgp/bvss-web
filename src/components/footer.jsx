import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* About Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">Brahmarishi Vishwamitra Research Center</h2>
            <p className="text-sm leading-6">
              Brahmarishi Vishwamitra Research Center is a spiritual and intellectual initiative dedicated to bridging ancient wisdom with modern science. It focuses on research, innovation, and social transformation through the principles of Gayatri philosophy and scientific spirituality.
            </p>
          </div>

          {/* Logo Section */}
          <div className="flex justify-center md:justify-end">
            <Link to="/" className="flex items-center">
              <img
                src="/Logo.jpg"
                alt="Brahmarishi Vishwamitra Research Center Logo"
                className="h-24 md:h-32 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700"></div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <div>
            © {new Date().getFullYear()} Brahmarishi Vishwamitra Research Center. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link to="/terms" className="hover:text-blue-500 transition">
              Terms and Conditions
            </Link>
            <Link to="/privacy" className="hover:text-blue-500 transition">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
