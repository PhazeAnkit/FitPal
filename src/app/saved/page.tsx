"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Select } from "@/components/ui/select";
import { Folder, Download, Trash2 } from "lucide-react";

const samplePlans = [
  {
    id: 1,
    title: "AI Plan - May 20, 2025",
    goal: "Muscle Gain",
    duration: "7 Days",
    date: "2025-05-20",
  },
  {
    id: 2,
    title: "AI Plan - Apr 15, 2025",
    goal: "Weight Loss",
    duration: "7 Days",
    date: "2025-04-15",
  },
  {
    id: 3,
    title: "AI Plan - May 18, 2025",
    goal: "Toning",
    duration: "7 Days",
    date: "2025-05-18",
  },
  {
    id: 4,
    title: "AI Plan - May 20, 2025",
    goal: "Muscle Gain",
    duration: "7 Days",
    date: "2025-05-20",
  },
];

export default function SavedPlansPage() {
  const [selectedFilter, setSelectedFilter] = useState("All Plans");
  const [sortOrder, setSortOrder] = useState("Newest");

  const filteredPlans =
    selectedFilter === "All Plans"
      ? samplePlans
      : samplePlans.filter((plan) => plan.goal === selectedFilter);

  const sortedPlans = [...filteredPlans].sort((a, b) =>
    sortOrder === "Newest"
      ? new Date(b.date).getTime() - new Date(a.date).getTime()
      : new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50 transition-colors">
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-12 space-y-10">
        <header className="text-center">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <Folder className="h-8 w-8 text-indigo-500" />
            <h1 className="text-4xl font-bold">My Saved Plans</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Revisit your previous fitness journeys
          </p>
        </header>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex space-x-2">
            {[
              "All Plans",
              "Muscle Gain",
              "Weight Loss",
              "Toning",
              "Endurance",
            ].map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "primary" : "secondary"}
                onClick={() => setSelectedFilter(filter)}
                className="px-4 py-2 text-sm"
              >
                {filter}
              </Button>
            ))}
          </div>

          <div className="w-40">
            <Select
              label="Sort by"
              options={[
                { value: "Newest", label: "Newest" },
                { value: "Oldest", label: "Oldest" },
              ]}
              value={sortOrder}
              onChange={(v) => setSortOrder(v)}
            />
          </div>
        </div>

        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {sortedPlans.map((plan) => (
            <Card
              key={plan.id}
              className="p-6 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold">{plan.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Goal: {plan.goal} • Duration: {plan.duration}
                </p>
              </div>

              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-indigo-500"
                  onClick={() => alert(`Downloading ${plan.title}`)}
                >
                  <Download className="h-5 w-5" />
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  className="px-4"
                  onClick={() => alert(`Opening ${plan.title}`)}
                >
                  Open Plan
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-red-500"
                  onClick={() => alert(`Deleting ${plan.title}`)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          ))}
        </section>

        {sortedPlans.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            No saved plans found.
          </div>
        )}
      </main>
    </div>
  );
}
