"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkoutCard } from "@/components/plan-card";
import { MealCard } from "@/components/meal-card";
import { Dumbbell, Salad, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [planData, setPlanData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);


  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        setError(null);


        const storedUser = sessionStorage.getItem("userData");
        const savedPlan =
          sessionStorage.getItem("aiPlan") ||
          localStorage.getItem("lastGeneratedPlan");

        if (savedPlan) {
          setPlanData(JSON.parse(savedPlan));
          setLoading(false);
          return;
        }

        if (!storedUser) {
          setError("No user data found. Please complete the form first.");
          setLoading(false);
          return;
        }

        const userData = JSON.parse(storedUser);


        const response = await fetch("/api/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch plan");
        }

        const data = await response.json();
        setPlanData(data.data);


        sessionStorage.setItem("aiPlan", JSON.stringify(data.data));
        localStorage.setItem("lastGeneratedPlan", JSON.stringify(data.data));
      } catch (err: any) {
        console.error("❌ Failed to fetch plan:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);


  const handleSavePlan = () => {
    if (!planData) return;

    const savedPlans = JSON.parse(localStorage.getItem("savedPlans") || "[]");
    const newPlan = {
      id: Date.now(),
      title: `AI Plan - ${new Date().toLocaleDateString()}`,
      goal: planData?.user_profile?.fitness_goal?.[0] || "General",
      duration: "7 Days",
      date: new Date().toISOString(),
      data: planData,
    };
    localStorage.setItem(
      "savedPlans",
      JSON.stringify([...savedPlans, newPlan])
    );
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };


  const handleSpeak = (text: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Your browser does not support speech synthesis.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };


  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-medium text-gray-600 dark:text-gray-300">
          Generating your personalized plan...
        </p>
      </div>
    );


  if (error || !planData)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg font-medium">{error}</p>
        <Button className="mt-4" onClick={() => router.push("/form")}>
          Go Back to Form
        </Button>
      </div>
    );


  const workoutDays = Object.entries(planData.exercise_plan || {});
  const mealDays = Object.entries(planData.diet_plan || {}).filter(([key]) =>
    key.startsWith("day")
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50 flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl space-y-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10">
          Your Personalized AI Fitness Plan
        </h1>


        <div className="grid md:grid-cols-2 gap-8">

          <Card className="p-6 space-y-4 shadow-lg">
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-6 w-6 text-indigo-500" />
              <h2 className="text-xl font-semibold">7-Day Workout Plan</h2>
            </div>

            {workoutDays.map(([day, data]: [string, any]) => (
              <WorkoutCard
                key={day}
                dayData={{
                  day: day.replace("day", "Day "),
                  focus: data.focus,
                  warm_up: data.warm_up,
                  cool_down: data.cool_down,
                  duration_min: data.duration_min,
                  workout: data.workout.map((w: any) => ({
                    name: w.name,
                    sets: w.sets,
                    reps: w.reps,
                  })),
                }}
                onExerciseClick={(ex) =>
                  console.log("🖼 Generate Image for:", ex.name)
                }
                onListen={(text) => handleSpeak(text)}
              />
            ))}

            <Button
              variant="secondary"
              className="w-full"
              onClick={() =>
                handleSpeak(
                  `Your weekly workout includes ${workoutDays.length} days, focusing on ${planData.user_profile.fitness_goal}.`
                )
              }
            >
              Listen to Full Workout Plan
            </Button>
          </Card>


          <Card className="p-6 space-y-6 shadow-lg">
            <div className="flex items-center space-x-2">
              <Salad className="h-6 w-6 text-green-500" />
              <h2 className="text-xl font-semibold">7-Day Meal Plan</h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Expand each day to view your meal breakdown.
            </p>
            <p className="text-xs text-gray-500">
              Daily Target: {planData.diet_plan.daily_targets.calories_kcal} kcal
            </p>

            <div className="space-y-4">
              {mealDays.map(([day, meals]) => (
                <MealCard
                  key={day}
                  day={day}
                  meals={meals as Record<string, string>}
                />
              ))}
            </div>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() =>
                handleSpeak(
                  `Your AI meal plan provides around ${planData.diet_plan.daily_targets.calories_kcal} calories per day with a ${planData.user_profile.dietary_preference} diet.`
                )
              }
            >
              Listen to Full Meal Plan
            </Button>
          </Card>
        </div>


        <Card className="p-6 mt-8 text-center shadow-lg">
          <div className="flex justify-center items-center mb-3">
            <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
            <h3 className="text-lg font-semibold">Motivation</h3>
          </div>
          <p className="text-xl font-medium bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Every rep counts — you’re stronger every day 💫
          </p>
        </Card>

        <div className="flex flex-wrap justify-center gap-4 pt-8">
          <Button variant="secondary" onClick={handleSavePlan}>
            {isSaved ? "Plan Saved!" : "Save Plan"}
          </Button>
          <Button variant="secondary">Download Diet PDF</Button>
          <Button variant="primary" onClick={() => router.push("/form")}>
            Regenerate Plan
          </Button>
          <Button variant="ghost" onClick={() => router.push("/saved")}>
            Go to Saved Plans
          </Button>
        </div>
      </main>
    </div>
  );
}
