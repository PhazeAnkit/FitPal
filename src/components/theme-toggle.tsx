"use client"; // Required for client-side interactivity in Next.js

import React from "react";
import { useTheme } from "../hooks/useTheme"; // ✅ Import from the real theme provider
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react"; // ✅ Use real icons (lucide-react)

/**
 * A button that toggles between light and dark mode.
 */
export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    // Toggle only between light and dark modes — ignore 'system' for simplicity
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-gray-700" />
      ) : (
        <Sun className="h-5 w-5 text-yellow-400" />
      )}
    </Button>
  );
};
