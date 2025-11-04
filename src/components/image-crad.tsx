"use client";

import React, { useEffect, useState } from "react";
import { Image as ImageIcon, Loader2, XCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Utility: combine Tailwind classes
function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Props
interface ImageCardProps {
  prompt: string;
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  onGenerate: (prompt: string) => void;
}

/**
 * ImageCard component — renders an AI-generated visual, with
 * graceful loading, error, and empty states.
 */
export const ImageCard: React.FC<ImageCardProps> = ({
  prompt,
  imageUrl,
  isLoading,
  error,
  onGenerate,
}) => {
  const [showError, setShowError] = useState(error);

  // Reset local error when props.error changes
  useEffect(() => {
    setShowError(error);
  }, [error]);

  // Handle click (generate or retry)
  const handleGenerateClick = () => {
    if (!isLoading) {
      setShowError(null);
      onGenerate(prompt);
    }
  };

  // --- Render States ---
  const renderContent = () => {
    if (isLoading) {
      // Loading State
      return (
        <motion.div
          key="loading"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center p-8 space-y-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg h-full relative"
        >
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
          <p className="text-gray-700 dark:text-gray-200 font-medium text-center">
            Generating visual for “{prompt}”
          </p>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
            />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            This might take a few seconds…
          </p>
        </motion.div>
      );
    }

    if (showError) {
      // Error State
      return (
        <motion.div
          key="error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center p-8 text-center h-full space-y-3"
        >
          <XCircle className="h-10 w-10 text-red-500" />
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Image Generation Failed
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
            {showError}
          </p>
          <motion.button
            onClick={handleGenerateClick}
            whileTap={{ scale: 0.95 }}
            className="mt-3 px-4 py-2 flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </motion.button>
        </motion.div>
      );
    }

    if (imageUrl) {
      // Display Image State
      return (
        <motion.div
          key="image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative h-full w-full overflow-hidden rounded-lg"
        >
          <motion.img
            src={imageUrl}
            alt={prompt}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "https://placehold.co/600x400/3B82F6/FFFFFF?text=Image+Load+Failed";
            }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2 text-sm text-white">
            {prompt}
          </div>
        </motion.div>
      );
    }

    // Placeholder State
    return (
      <motion.div
        key="placeholder"
        whileHover={{ scale: 1.02 }}
        className="flex flex-col items-center justify-center p-8 space-y-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-full cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        onClick={handleGenerateClick}
        title={`Generate visual for: ${prompt}`}
      >
        <ImageIcon className="h-10 w-10 text-gray-400" />
        <p className="text-center text-gray-600 dark:text-gray-400 font-medium">
          Visualize “{prompt}”
        </p>
        <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
          Generate
        </button>
      </motion.div>
    );
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden w-full transition-all duration-300"
      aria-live="polite"
    >
      <div className="p-4 space-y-3">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
          {prompt}
        </h3>
        <div className="aspect-video w-full overflow-hidden">
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </div>
      </div>
    </div>
  );
};
