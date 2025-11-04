"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkoutCard } from "@/components/plan-card";
import { ImageCard } from "@/components/image-crad";
import { VoiceButton } from "@/components/voice-button";
import { Dumbbell, Salad, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingProgress, setSpeakingProgress] = useState(0);

  const workoutData = {
    day: 1,
    title: "Full Body Strength",
    exercises: [
      { id: "1", name: "Push-Ups", reps: "3x15 reps" },
      { id: "2", name: "Squats", reps: "3x20 reps" },
      { id: "3", name: "Plank", reps: "3x60 sec" },
    ],
  };

  const meals = [
    {
      name: "Breakfast",
      description: "Oatmeal with berries & nuts",
      calories: 350,
      img: "https://placehold.co/400x250?text=Breakfast",
    },
    {
      name: "Lunch",
      description: "Grilled chicken salad",
      calories: 420,
      img: "https://placehold.co/400x250?text=Lunch",
    },
    {
      name: "Dinner",
      description: "Baked salmon with veggies",
      calories: 480,
      img: "https://placehold.co/400x250?text=Dinner",
    },
    {
      name: "Snack",
      description: "Greek yogurt & honey",
      calories: 150,
      img: "https://placehold.co/400x250?text=Snack",
    },
  ];

  const handleSpeak = (section: "all" | "workout" | "diet" | "motivation") => {
    setIsSpeaking(true);
    console.log("🔊 Reading section:", section);

    setTimeout(() => {
      setIsSpeaking(false);
      setSpeakingProgress(100);
    }, 3000);
  };

  const handleStop = () => {
    setIsSpeaking(false);
    setSpeakingProgress(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50 flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl space-y-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10">
          Here’s your personalized plan <span className="ml-2">👇</span>
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 space-y-4 shadow-lg">
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-6 w-6 text-indigo-500" />
              <h2 className="text-xl font-semibold">Your 7-Day Workout Plan</h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click any exercise to see how it looks!
            </p>

            <WorkoutCard
              dayData={workoutData}
              onExerciseClick={(ex) => console.log("Exercise:", ex.name)}
              onListen={(text) => console.log("Listening:", text)}
            />

            <Button variant="secondary" className="w-full">
              Listen Workout Plan
            </Button>
          </Card>

          <Card className="p-6 space-y-6 shadow-lg">
            <div className="flex items-center space-x-2">
              <Salad className="h-6 w-6 text-green-500" />
              <h2 className="text-xl font-semibold">AI-Generated Meal Plan</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {meals.map((meal) => (
                <ImageCard
                  key={meal.name}
                  prompt={meal.name}
                  imageUrl={meal.img}
                  isLoading={false}
                  error={null}
                  onGenerate={(prompt) =>
                    console.log("Generate new image for", prompt)
                  }
                />
              ))}
            </div>

            <Button variant="secondary" className="w-full">
              Listen Diet Plan
            </Button>
          </Card>
        </div>

        <Card className="p-6 mt-8 text-center shadow-lg">
          <div className="flex justify-center items-center mb-3">
            <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
            <h3 className="text-lg font-semibold">Motivation</h3>
          </div>
          <p className="text-xl font-medium bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Every rep counts — you’re stronger every day 💪
          </p>
        </Card>

        <div className="flex flex-wrap justify-center gap-4 pt-8">
          <Button variant="secondary">Save Plan</Button>
          <Button variant="secondary">Diet PDF</Button>
          <Button variant="primary">Regenerate Plan</Button>
          <Button variant="ghost">Back to Form</Button>
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
