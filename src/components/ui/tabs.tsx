"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * ----------------------------------------------------------------------------
 * TABS COMPONENT
 * ----------------------------------------------------------------------------
 * A simple, accessible tabbed interface for switching between sections.
 *
 * Features:
 * ✅ Keyboard accessible (arrow keys / focus)
 * ✅ Dark mode ready
 * ✅ Animated active indicator
 * ✅ Optional icons
 * ✅ Lightweight and composable
 * ----------------------------------------------------------------------------
 */

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  className,
}) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0].id);
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = tabs.findIndex((t) => t.id === activeTab);
    let newIndex = currentIndex;

    if (e.key === "ArrowRight") {
      newIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    }

    if (newIndex !== currentIndex) {
      const newId = tabs[newIndex].id;
      setActiveTab(newId);
      onChange?.(newId);
      tabRefs.current[newIndex]?.focus();
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Tab List */}
      <div
        role="tablist"
        aria-label="Tabs"
        className="relative flex items-center justify-start border-b border-gray-200 dark:border-gray-700 overflow-x-auto"
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab, idx) => {
            const isActive = tab.id === activeTab;

            return (
                <button
                key={tab.id}
                ref={(el) => {
                    tabRefs.current[idx] = el;
                }}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => {
                    setActiveTab(tab.id);
                    onChange?.(tab.id);
                }}
                className={cn(
                    "relative px-5 py-2.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 whitespace-nowrap",
                    isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                )}
                >
                {tab.icon && (
                    <span className="mr-2 inline-flex items-center text-base">
                    {tab.icon}
                    </span>
                )}
                {tab.label}

                {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600 dark:bg-indigo-400 rounded-t-md transition-all duration-300" />
                )}
                </button>
            );
            })}

      </div>

      {/* Tab Panels */}
      <div className="mt-6">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            hidden={tab.id !== activeTab}
            className="focus-visible:outline-none"
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};
