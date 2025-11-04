"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, Download, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/select";
import { ConfirmationModal } from "@/components/modal";

interface SavedPlan {
  id: number;
  title: string;
  goal: string;
  duration: string;
  date: string;
  data: any;
}

type ModalAction = {
  type: "open" | "delete" | "download" | null;
  plan?: SavedPlan | null;
};

export default function SavedPlansPage() {
  const router = useRouter();
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("All Plans");
  const [sortOrder, setSortOrder] = useState("Newest");

  const [modal, setModal] = useState<ModalAction>({ type: null, plan: null });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedPlans") || "[]");
    setSavedPlans(stored);
  }, []);

  const filteredPlans =
    selectedFilter === "All Plans"
      ? savedPlans
      : savedPlans.filter((p) => p.goal === selectedFilter);

  const sortedPlans = [...filteredPlans].sort((a, b) =>
    sortOrder === "Newest"
      ? new Date(b.date).getTime() - new Date(a.date).getTime()
      : new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const openModal = (type: ModalAction["type"], plan?: SavedPlan) =>
    setModal({ type, plan });

  const closeModal = () => setModal({ type: null, plan: null });

  const handleConfirm = () => {
    const plan = modal.plan;
    if (!plan) return;

    switch (modal.type) {
      case "delete":
        const updated = savedPlans.filter((p) => p.id !== plan.id);
        setSavedPlans(updated);
        localStorage.setItem("savedPlans", JSON.stringify(updated));
        break;

      case "open":
        sessionStorage.setItem("aiPlan", JSON.stringify(plan.data));
        localStorage.setItem("lastGeneratedPlan", JSON.stringify(plan.data));
        router.push("/dashboard");
        break;

      case "download":
        const blob = new Blob([JSON.stringify(plan.data, null, 2)], {
          type: "application/json",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${plan.title.replace(/\s+/g, "_")}.json`;
        link.click();
        break;
    }

    closeModal();
  };

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
            {["All Plans", "Muscle Gain", "Weight Loss", "Toning", "Endurance"].map(
              (filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "primary" : "secondary"}
                  onClick={() => setSelectedFilter(filter)}
                  className="px-4 py-2 text-sm"
                >
                  {filter}
                </Button>
              )
            )}
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
                <p className="text-xs text-gray-500 mt-1">
                  Saved on {new Date(plan.date).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-indigo-500"
                  onClick={() => openModal("download", plan)}
                >
                  <Download className="h-5 w-5" />
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  className="px-4"
                  onClick={() => openModal("open", plan)}
                >
                  Open Plan
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-red-500"
                  onClick={() => openModal("delete", plan)}
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

      <ConfirmationModal
        open={!!modal.type}
        title={
          modal.type === "delete"
            ? "Delete Saved Plan?"
            : modal.type === "open"
            ? "Open Saved Plan?"
            : "Download Plan?"
        }
        message={
          modal.type === "delete"
            ? `Are you sure you want to delete "${modal.plan?.title}"?`
            : modal.type === "open"
            ? `This will load "${modal.plan?.title}" into your dashboard.`
            : `Download "${modal.plan?.title}" as a JSON file.`
        }
        confirmLabel={
          modal.type === "delete"
            ? "Delete"
            : modal.type === "open"
            ? "Open"
            : "Download"
        }
        type={
          modal.type === "delete"
            ? "delete"
            : modal.type === "open"
            ? "info"
            : "warning"
        }
        onConfirm={handleConfirm}
        onCancel={closeModal}
      />
    </div>
  );
}
