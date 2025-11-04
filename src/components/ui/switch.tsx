"use client";

import * as React from "react";
import { motion } from "framer-motion";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  disabled,
}) => {
  return (
    <label
      className={`relative inline-flex items-center cursor-pointer ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onCheckedChange(e.target.checked)}
      />
      <motion.div
        className={`w-11 h-6 rounded-full transition-colors duration-300 ${
          checked ? "bg-indigo-600" : "bg-gray-400 dark:bg-gray-700"
        }`}
        layout
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 600, damping: 30 }}
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </motion.div>
    </label>
  );
};
