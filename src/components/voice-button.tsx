"use client";

import React, { useState, useCallback } from "react";
import { Volume2, VolumeX, Menu, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  { label: "Read Full Plan", value: "all" },
  { label: "Workout Only", value: "workout" },
  { label: "Diet Only", value: "diet" },
  { label: "Motivation Only", value: "motivation" },
];

interface VoiceButtonProps {
  onSpeak: (section: "all" | "workout" | "diet" | "motivation") => void;
  onStop: () => void;
  isSpeaking: boolean;
  speakingProgress: number; // 0-100
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onSpeak,
  onStop,
  isSpeaking,
  speakingProgress,
}) => {
  const [selected, setSelected] = useState<"all" | "workout" | "diet" | "motivation">("all");
  const [open, setOpen] = useState(false);

  const handleAction = useCallback(() => {
    if (isSpeaking) onStop();
    else onSpeak(selected);
  }, [isSpeaking, onStop, onSpeak, selected]);

  return (
    <div className="fixed bottom-8 right-8 flex flex-col items-end gap-4 z-[999]">
      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg p-2 w-52"
          >
            {sections.map((sec) => (
              <button
                key={sec.value}
                onClick={() => {
                  setSelected(sec.value as any);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                  selected === sec.value
                    ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                {sec.label}
                {selected === sec.value && <Check className="h-4 w-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleAction}
        style={{
          boxShadow: isSpeaking
            ? "0 0 0 6px rgba(99,102,241,0.4)"
            : "0 0 10px rgba(0,0,0,0.2)",
        }}
        className={`relative w-16 h-16 flex items-center justify-center rounded-full text-white shadow-lg ${
          isSpeaking ? "bg-red-500" : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {isSpeaking ? (
          <VolumeX className="h-8 w-8 animate-pulse" />
        ) : (
          <Volume2 className="h-8 w-8" />
        )}

        {/* Progress ring */}
        {isSpeaking && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-indigo-300 border-t-indigo-600 animate-spin-slow"
            style={{ opacity: 0.6 }}
          />
        )}
      </motion.button>

      {/* Menu toggle */}
      {!isSpeaking && (
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};
