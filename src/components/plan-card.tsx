"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Dumbbell,
  Volume2,
  Image as ImageIcon,
} from "lucide-react";

// --- Utility ---
function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

// --- Button Component (You can replace with shadcn/ui <Button />) ---
const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" }
> = ({ children, variant = "primary", className, ...props }) => {
  const base = "px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all";
  const style =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
      : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600";

  return (
    <button className={cn(base, style, className)} {...props}>
      {children}
    </button>
  );
};

// --- Data Types ---
interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
}

interface WorkoutDay {
  day: number;
  title: string;
  exercises: Exercise[];
}

interface WorkoutCardProps {
  dayData: WorkoutDay;
  onExerciseClick: (exercise: Exercise) => void;
  onListen: (text: string) => void;
}

/**
 * Renders a single day's workout plan with collapsible exercises and TTS option.
 */
export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  dayData,
  onExerciseClick,
  onListen,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Generate a clean, natural sentence for TTS
  const getWorkoutText = (data: WorkoutDay): string => {
    const intro = `Workout plan for ${data.title}.`;
    const details = data.exercises
      .map((ex, i) => `${ex.name}, ${ex.reps}`)
      .join(", then ");
    return `${intro} Your exercises are ${details}.`;
  };

  return (
    <div
      className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-md bg-white dark:bg-gray-800 transition-all duration-300"
      role="region"
      aria-labelledby={`day-${dayData.day}-title`}
    >
      {/* Header */}
      <button
        id={`day-${dayData.day}-title`}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex justify-between items-center p-4 rounded-t-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={isOpen}
      >
        <h3 className="flex items-center space-x-3 text-lg font-semibold text-gray-900 dark:text-white">
          <Dumbbell className="h-6 w-6 text-blue-600" />
          <span>
            Day {dayData.day}: {dayData.title}
          </span>
        </h3>
        <ChevronDown
          className={cn(
            "h-6 w-6 text-gray-500 transition-transform duration-300",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="border-t border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Exercise List */}
              <ul className="space-y-2">
                {dayData.exercises.map((exercise) => (
                  <li
                    key={exercise.id}
                    className="flex justify-between items-center p-3 border border-gray-100 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => onExerciseClick(exercise)}
                  >
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {exercise.name}{" "}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        — {exercise.reps}
                      </span>
                    </span>
                    <ImageIcon
                      className="h-5 w-5 text-blue-500 hover:text-blue-600"
                      title="View exercise demo"
                    />
                  </li>
                ))}
              </ul>

              {/* Listen Button */}
              <div className="pt-2">
                <Button
                  variant="secondary"
                  onClick={() => onListen(getWorkoutText(dayData))}
                  className="w-full"
                >
                  <Volume2 className="h-5 w-5" />
                  <span>Listen to Plan</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
