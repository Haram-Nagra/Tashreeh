import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#1E3A8A] py-6">
      <div className="max-w-screen-xl mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:justify-between">
          {/* Logo and Footer Title */}
          <div className="flex items-center mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                alt="Logo"
                className="h-8"
              />
              <span className="font-semibold text-white text-2xl ml-2">
                Tashreeh
              </span>
            </Link>
          </div>

          {/* Footer Links */}
          <div className="flex flex-col md:flex-row md:space-x-8 text-white">
            <Link to="#" className="hover:text-blue-300 text-sm mb-2 md:mb-0">
              Solutions
            </Link>
            <Link to="#" className="hover:text-blue-300 text-sm mb-2 md:mb-0">
              Apps & Integrations
            </Link>
            <Link to="#" className="hover:text-blue-300 text-sm mb-2 md:mb-0">
              Resources
            </Link>
            <Link to="#" className="hover:text-blue-300 text-sm mb-2 md:mb-0">
              Blog
            </Link>
            <Link to="#" className="hover:text-blue-300 text-sm mb-2 md:mb-0">
              Careers
            </Link>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        <div className="text-center text-sm text-gray-300">
          <span>© 2023 </span>
          <Link
            to="https://flowbite.com/"
            className="hover:underline text-white"
          >
            Tashreeh™
          </Link>
          <span> All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
