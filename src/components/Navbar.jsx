import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" onClick={closeMenu} className="flex items-center">
              <img
                src="/Logo.jpg" // put your logo in public/logo.png
                alt="Logo"
                className="h-16 w-full" // adjust height as needed
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600">
              About
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-blue-600">
              Blog
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600">
              Contact
            </Link>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Sign In
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
            >
              {isOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-white shadow-md">
          <Link
            to="/"
            className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded"
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded"
            onClick={closeMenu}
          >
            About
          </Link>
          <Link
            to="/services"
            className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded"
            onClick={closeMenu}
          >
            Services
          </Link>
          <Link
            to="/contact"
            className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded"
            onClick={closeMenu}
          >
            Contact
          </Link>
          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Sign In
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
