"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Salad } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MealData {
  breakfast: string;
  snack_am: string;
  lunch: string;
  snack_pm: string;
  dinner: string;
}

interface MealCardProps {
  day: string;
  meals: MealData;
}

export const MealCard: React.FC<MealCardProps> = ({ day, meals }) => {
  const [open, setOpen] = useState(false);

  return (
    <Card className="p-4 shadow-md border dark:border-gray-800 transition-all">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center space-x-2">
          <Salad className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold">
            {day.replace(/day/i, "Day ")}
          </h3>
        </div>
        {open ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-300"
          >
            <div>
              <strong>🥣 Breakfast:</strong> {meals.breakfast}
            </div>
            <div>
              <strong>🍎 Snack (AM):</strong> {meals.snack_am}
            </div>
            <div>
              <strong>🥗 Lunch:</strong> {meals.lunch}
            </div>
            <div>
              <strong>☕ Snack (PM):</strong> {meals.snack_pm}
            </div>
            <div>
              <strong>🍛 Dinner:</strong> {meals.dinner}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
