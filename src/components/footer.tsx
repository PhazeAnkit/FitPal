"use client";

import React from "react";
import Link from "next/link";

/**
 * Application Footer Component
 * - Responsive and minimal
 * - Supports dark/light themes
 * - Uses dynamic year
 */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between h-16 px-4 text-sm text-gray-600 dark:text-gray-400">
        {/* Left Side: Copyright */}
        <p className="text-center sm:text-left">
          Built for Internship Challenge | © {currentYear} FitAI
        </p>

        {/* Right Side: Quick Links */}
        <div className="mt-2 sm:mt-0 flex space-x-4">
          <Link
            href="/privacy"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Terms
          </Link>
          <Link
            href="/contact"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};
