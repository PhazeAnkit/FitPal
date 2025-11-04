"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkoutCard } from "@/components/plan-card";
import { ImageCard } from "@/components/image-crad";
import { VoiceButton } from "@/components/voice-button";
import { Dumbbell, Salad, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { MealCard } from "@/components/meal-card";

export default function DashboardPage() {
  const router = useRouter();
  const [planData, setPlanData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingProgress, setSpeakingProgress] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved =
      sessionStorage.getItem("aiPlan") ||
      localStorage.getItem("lastGeneratedPlan");
    if (saved) {
      setPlanData(JSON.parse(saved));
      setLoading(false);
    } else {
      setError("No plan found. Please generate one from the form.");
      setLoading(false);
    }
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
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleSpeak = (section: "all" | "workout" | "diet" | "motivation") => {
    setIsSpeaking(true);
    setTimeout(() => {
      setIsSpeaking(false);
      setSpeakingProgress(100);
    }, 3000);
  };

  const handleStop = () => {
    setIsSpeaking(false);
    setSpeakingProgress(0);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-medium text-gray-600 dark:text-gray-300">
          Loading your personalized plan...
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
  const mealDays = Object.entries(planData.diet_plan?.day1 || {}) as [
    string,
    string
  ][];

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
            {workoutDays.map(([day, data]: any) => (
              <WorkoutCard
                key={day}
                dayData={{
                  day,
                  title: data.focus,
                  exercises: (data.workout || []).map((w: any, i: number) => ({
                    id: `${day}-${i}`,
                    name: w.name,
                    reps: `${w.sets} sets x ${w.reps}`,
                  })),
                }}
                onExerciseClick={(ex) => console.log("Exercise:", ex.name)}
                onListen={(text) => console.log("Listening:", text)}
              />
            ))}
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
              Daily Target: {planData.diet_plan.daily_targets.calories_kcal}{" "}
              kcal
            </p>

            <div className="space-y-4">
              {Object.entries(planData.diet_plan || {})
                .filter(([key]) => key.startsWith("day"))
                .map(([day, meals]) => (
                  <MealCard key={day} day={day} meals={meals as any} />
                ))}
            </div>

            <Button variant="secondary" className="w-full">
              Listen to Diet Plan
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
            {isSaved ? "✅ Plan Saved!" : "Save Plan"}
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

      <VoiceButton
        onSpeak={handleSpeak}
        isSpeaking={isSpeaking}
        onStop={handleStop}
        speakingProgress={speakingProgress}
      />
    </div>
  );
}
