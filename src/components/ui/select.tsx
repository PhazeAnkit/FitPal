"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
  className?: string;
}

/**
 * ✨ Modern, animated dropdown with portal rendering
 * Features:
 * - Framer Motion animation
 * - Keyboard accessible
 * - Light/Dark support
 * - Works perfectly inside modals and cards (no clipping)
 */
export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  error,
  className = "",
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownRect, setDropdownRect] = React.useState<DOMRect | null>(null);
  const [highlightedIndex, setHighlightedIndex] = React.useState<number>(-1);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  // Detect dropdown position
  React.useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownRect(rect);
    }
  }, [isOpen]);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : options.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          handleSelect(options[highlightedIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (val: string) => {
    onChange?.(val);
    setIsOpen(false);
  };

  const dropdownContent =
    dropdownRect &&
    createPortal(
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            ref={listRef}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              top: dropdownRect.bottom + window.scrollY + 4,
              left: dropdownRect.left + window.scrollX,
              width: dropdownRect.width,
            }}
            className="z-[9999] max-h-48 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl text-sm"
          >
            {options.map((opt, i) => (
              <li
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                onMouseEnter={() => setHighlightedIndex(i)}
                className={`px-3 py-2 cursor-pointer transition-colors duration-150 ${
                  opt.value === value
                    ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-medium"
                    : highlightedIndex === i
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-50"
                    : "text-gray-800 dark:text-gray-200"
                }`}
              >
                {opt.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>,
      document.body
    );

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
          {label}
        </label>
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        onKeyDown={handleKeyDown}
        className={`relative w-full flex justify-between items-center px-3 py-2 text-sm rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        }`}
      >
        <span
          className={`truncate ${
            !value ? "text-gray-400 dark:text-gray-500 italic" : ""
          }`}
        >
          {value || placeholder}
        </span>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </motion.div>
      </button>

      {dropdownContent}

      {error && (
        <p className="text-sm text-red-500 mt-1 animate-fade-in">{error}</p>
      )}
    </div>
  );
};
