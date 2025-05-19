import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/logo.png";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/demo", text: "Schedule a Demo" },
    { to: "/pricing", text: "Pricing" },
    { to: "/Contact", text: "Contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 mt-4 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-20 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.img
                src={Logo}
                alt="Tashreeh Logo"
                className="h-8 rounded-full"
                initial={{ rotate: -180 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.5 }}
              />
              <motion.span
                className="font-bold text-3xl bg-black bg-clip-text text-transparent ml-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Tashreeh
              </motion.span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center ml-8 space-x-8">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="relative group">
                <span
                  className={`text-gray-700 hover:text-blue-600 transition-colors duration-300 text-md
                  ${location.pathname === link.to ? "text-blue-600" : ""}`}
                >
                  {link.text}
                </span>
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full
                  ${location.pathname === link.to ? "w-full" : ""}`}
                />
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
              >
                Log in
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/create-account"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 
                  transition-all duration-300 text-md font-medium shadow-md hover:shadow-lg"
              >
                Start for free
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              {mobileMenuOpen ? (
                <HiOutlineX className="h-6 w-6" />
              ) : (
                <HiOutlineMenu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: mobileMenuOpen ? 1 : 0,
            height: mobileMenuOpen ? "auto" : 0,
          }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block text-gray-700 hover:text-blue-600 transition-colors duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.text}
              </Link>
            ))}
            <div className="pt-4 space-y-4">
              <Link
                to="/login"
                className="block text-gray-700 hover:text-blue-600 transition-colors duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                to="/create-account"
                className="block bg-blue-600 text-white px-6 py-2.5 rounded-full text-center 
                  hover:bg-blue-700 transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Start for free
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
