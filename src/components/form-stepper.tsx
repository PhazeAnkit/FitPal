"use client";

import React from "react";
import { CheckCircle2, Circle, Dumbbell, HeartPulse, User } from "lucide-react";
import { motion } from "framer-motion";

interface FormStepperProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

/**
 * Elegant, animated multi-step progress tracker for forms.
 */
export const FormStepper: React.FC<FormStepperProps> = ({
  currentStep,
  totalSteps,
  onStepClick,
}) => {
  const steps = [
    { id: 1, label: "Basic Info", icon: <User className="h-4 w-4" /> },
    { id: 2, label: "Fitness & Lifestyle", icon: <Dumbbell className="h-4 w-4" /> },
    { id: 3, label: "Preferences", icon: <HeartPulse className="h-4 w-4" /> },
  ];

  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="relative w-full px-2 md:px-8 py-6">
      {/* --- Progress Bar Background --- */}
      <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-gray-200 dark:bg-gray-700 rounded-full -translate-y-1/2" />

      {/* --- Animated Progress Bar --- */}
      <motion.div
        className="absolute top-1/2 left-0 h-[3px] bg-indigo-500 dark:bg-indigo-400 rounded-full -translate-y-1/2"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />

      {/* --- Step Circles + Labels --- */}
      <div className="relative flex justify-between z-10">
        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div
              key={step.id}
              onClick={() => onStepClick?.(step.id)}
              className="flex flex-col items-center cursor-pointer group select-none"
            >
              {/* --- Step Circle --- */}
              <motion.div
                whileHover={{ scale: isActive ? 1.05 : 1.1 }}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  isCompleted
                    ? "bg-indigo-500 border-indigo-500 text-white shadow-sm"
                    : isActive
                    ? "bg-white dark:bg-gray-900 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  step.icon
                )}
              </motion.div>

              {/* --- Step Label --- */}
              <div className="text-center mt-2">
                <span
                  className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-indigo-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
