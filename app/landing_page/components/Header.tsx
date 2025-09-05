"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaCode, FaBars, FaTimes, FaUser, FaSignInAlt, FaSun, FaMoon } from "react-icons/fa";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // You can implement theme persistence here if needed
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md py-2 shadow-lg border-b border-gray-100"
          : "bg-white py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-colors">
            <FaCode className="text-white text-xl" />
          </div>
          <span className="text-xl font-bold text-gray-800">Coding Clash</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="#features"
            className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            How It Works
          </Link>
          <Link
            href="#pricing"
            className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            FAQ
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors hidden md:flex"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors flex items-center font-medium"
            >
              <FaSignInAlt className="mr-2" /> Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center font-medium shadow-md hover:shadow-lg"
            >
              <FaUser className="mr-2" /> Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white transition-all duration-300 overflow-hidden ${
          isMenuOpen ? "max-h-96 py-4 shadow-lg border-b border-gray-100" : "max-h-0 py-0"
        }`}
      >
        <div className="container mx-auto px-4 flex flex-col space-y-4">
          <Link
            href="#features"
            className="text-gray-600 hover:text-blue-600 transition-colors py-2 font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-gray-600 hover:text-blue-600 transition-colors py-2 font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            How It Works
          </Link>
          <Link
            href="#pricing"
            className="text-gray-600 hover:text-blue-600 transition-colors py-2 font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className="text-gray-600 hover:text-blue-600 transition-colors py-2 font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            FAQ
          </Link>
          
          {/* Theme toggle for mobile */}
          <button
            onClick={() => {
              toggleDarkMode();
              setIsMenuOpen(false);
            }}
            className="py-2 text-gray-600 hover:text-blue-600 transition-colors flex items-center font-medium"
          >
            {darkMode ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          
          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-4">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors flex items-center justify-center font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaSignInAlt className="mr-2" /> Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center font-medium shadow-md hover:shadow-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaUser className="mr-2" /> Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}