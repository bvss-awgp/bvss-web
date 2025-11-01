import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Logo + About */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">Brahmarishi Vishwamitra Research Center</h2>
          <p className="text-sm leading-6">
          Brahmarishi Vishwamitra Research Center is a spiritual and intellectual initiative dedicated to bridging ancient wisdom with modern science. It focuses on research, innovation, and social transformation through the principles of Gayatri philosophy and scientific spirituality.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-500 transition">Home</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">About</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">AWGP Mission</a></li>
             <li><a href="#" className="hover:text-blue-500 transition">Contribute</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">Contact</a></li>
          </ul>
        </div>

        {/* Social Icons */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-500 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.28 4.28 0 001.88-2.36 8.53 8.53 0 01-2.7 1.03A4.27 4.27 0 0016.1 4a4.27 4.27 0 00-4.27 4.27c0 .34.04.67.1.99A12.12 12.12 0 013 5.1a4.27 4.27 0 001.32 5.7 4.24 4.24 0 01-1.93-.53v.05a4.28 4.28 0 003.43 4.19 4.25 4.25 0 01-1.92.07 4.28 4.28 0 004 2.98A8.56 8.56 0 012 19.54a12.06 12.06 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.55A8.63 8.63 0 0022.46 6z" />
              </svg>
            </a>
            <a href="#" className="hover:text-blue-500 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M12 2.04c-5.52 0-10 4.48-10 10 0 4.42 3.59 8.08 8.19 8.93v-6.31H8.08v-2.62h2.11V9.61c0-2.1 1.25-3.27 3.16-3.27.92 0 1.87.16 1.87.16v2.06h-1.05c-1.04 0-1.36.65-1.36 1.32v1.58h2.31l-.37 2.62h-1.94v6.31A10 10 0 0022 12.04c0-5.52-4.48-10-10-10z" />
              </svg>
            </a>
            <a href="#" className="hover:text-blue-500 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M19.6 3H4.4A1.4 1.4 0 003 4.4v15.2A1.4 1.4 0 004.4 21h8.2v-6.6H10V12h2.6v-1.9c0-2.6 1.6-4 3.9-4 1.1 0 2 .08 2.3.11v2.7h-1.6c-1.3 0-1.5.6-1.5 1.5V12H19l-.4 2.4h-2.5V21h3.5a1.4 1.4 0 001.4-1.4V4.4A1.4 1.4 0 0019.6 3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700"></div>

      {/* Copyright Bar */}
      <div className="text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} BVSS. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
