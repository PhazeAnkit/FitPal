"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Dumbbell,
  Volume2,
  VolumeX,
  Image as ImageIcon,
  Loader2,
  Clock,
  Flame,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

interface Exercise {
  name: string;
  sets: number;
  reps: string;
}

interface WorkoutDay {
  day: string;
  focus: string;
  warm_up?: string;
  cool_down?: string;
  duration_min?: number;
  workout: Exercise[];
}

interface WorkoutCardProps {
  dayData: WorkoutDay;
  onExerciseClick: (exercise: Exercise, imageUrl?: string) => void;
  onListen: (text: string) => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  dayData,
  onExerciseClick,
  onListen,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingImage, setLoadingImage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const getWorkoutText = (data: WorkoutDay): string => {
    const intro = `Your ${data.focus} workout for ${data.day}.`;
    const warmup = data.warm_up ? `Warm up: ${data.warm_up}.` : "";
    const details = data.workout
      .map((ex) => `${ex.name} for ${ex.reps}`)
      .join(", then ");
    const cooldown = data.cool_down ? `Cool down: ${data.cool_down}.` : "";
    return `${intro} ${warmup} Exercises include ${details}. ${cooldown}`;
  };

  const handleGenerateImage = async (exercise: Exercise) => {
  try {
    setLoadingImage(exercise.name);

    const res = await fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exerciseData: {
          ...exercise,
          focus: dayData.focus,
          day: dayData.day,
          duration: dayData.duration_min,
        },
      }),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    setPreviewImage(data.url);
    onExerciseClick(exercise, data.url);
  } catch (error: any) {
    console.error("Image generation failed:", error);
    alert("Image generation failed. Please try again.");
  } finally {
    setLoadingImage(null);
  }
};


  const handleListen = () => {
    const text = getWorkoutText(dayData);

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    onListen(text);
  };

  return (
    <>
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md p-4">
              <img
                src={previewImage}
                alt="Exercise Preview"
                className="rounded-lg object-cover w-full h-auto"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => setPreviewImage(null)}
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Card
        className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-md bg-white dark:bg-gray-800 transition-all duration-300"
        role="region"
        aria-labelledby={`day-${dayData.day}-title`}
      >
        <button
          id={`day-${dayData.day}-title`}
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex justify-between items-center p-4 rounded-t-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-expanded={isOpen}
        >
          <div className="flex items-center space-x-3">
            <Dumbbell className="h-6 w-6 text-indigo-500" />
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {dayData.day}: {dayData.focus}
              </h3>
              {dayData.duration_min && (
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {dayData.duration_min} min session
                </p>
              )}
            </div>
          </div>
          <ChevronDown
            className={cn(
              "h-6 w-6 text-gray-500 transition-transform duration-300",
              isOpen ? "rotate-180" : "rotate-0"
            )}
          />
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="border-t border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-4 space-y-4">
                {dayData.warm_up && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic flex items-center gap-1">
                    <Flame className="h-4 w-4 text-orange-400" /> Warm-up:{" "}
                    {dayData.warm_up}
                  </p>
                )}

                <ul className="space-y-2">
                  {dayData.workout.map((exercise) => (
                    <li
                      key={exercise.name}
                      className="flex justify-between items-center p-3 border border-gray-100 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div
                        className="flex flex-col cursor-pointer"
                        onClick={() => onExerciseClick(exercise)}
                      >
                        <span className="font-medium text-gray-800 dark:text-gray-100">
                          {exercise.name}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {exercise.sets} sets × {exercise.reps}
                        </span>
                      </div>

                      <Button
                        variant="secondary"
                        size="icon"
                        className="!p-2"
                        onClick={() => handleGenerateImage(exercise)}
                        disabled={loadingImage === exercise.name}
                        aria-label={`Generate image for ${exercise.name}`}
                      >
                        {loadingImage === exercise.name ? (
                          <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-indigo-500" />
                        )}
                      </Button>
                    </li>
                  ))}
                </ul>

                {dayData.cool_down && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    🧘 Cool-down: {dayData.cool_down}
                  </p>
                )}

                <div className="pt-3 flex justify-between items-center gap-3">
                  <Button
                    variant="primary"
                    onClick={handleListen}
                    className="flex-1"
                  >
                    {isSpeaking ? "Stop" : "Listen to Plan"}
                  </Button>

                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleListen}
                    aria-label={
                      isSpeaking ? "Stop listening" : "Play workout plan audio"
                    }
                  >
                    {isSpeaking ? (
                      <VolumeX className="h-5 w-5 text-indigo-500" />
                    ) : (
                      <Volume2 className="h-5 w-5 text-indigo-500" />
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </>
  );
};
