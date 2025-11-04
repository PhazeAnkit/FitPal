"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormStepper } from "@/components/form-stepper";
import { Loader2 } from "lucide-react";

const GeneratingModal = ({ open }: { open: boolean }) => {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full mx-4"
        >
          <Loader2 className="h-10 w-10 mx-auto text-indigo-500 animate-spin mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
            Generating Your Personalized AI Plan...
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Our AI coach is analyzing your fitness goals, nutrition, and preferences.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-3 italic">
            This may take 10–20 seconds
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const formSchema = z.object({
  age: z.string().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  height: z.string().min(1, "Height is required"),
  weight: z.string().min(1, "Weight is required"),
  goal: z.string().min(1, "Please select a goal"),
  level: z.string().min(1, "Please select fitness level"),
  location: z.string().min(1, "Please select workout location"),
  diet: z.string().min(1, "Please select diet type"),
  medical: z.string().optional(),
  notes: z.string().optional(),
  stress: z
    .string()
    .refine((v) => Number(v) >= 1 && Number(v) <= 10, "Stress must be between 1–10"),
});

type FormData = z.infer<typeof formSchema>;

export default function FitnessFormPage() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const totalSteps = 3;
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: "",
      gender: "",
      height: "",
      weight: "",
      goal: "",
      level: "",
      location: "",
      diet: "",
      medical: "",
      notes: "",
      stress: "5",
    },
  });

  const handleNext = async () => {
    const fieldsToValidate =
      step === 1
        ? ["age", "gender", "height", "weight"]
        : step === 2
        ? ["goal", "level", "location", "diet"]
        : ["stress"];

    const valid = await trigger(fieldsToValidate as (keyof FormData)[]);
    if (valid) setStep((s) => Math.min(s + 1, totalSteps));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setIsGenerating(true);

      const payload = {
        age: Number(data.age),
        weight: Number(data.weight),
        gender: data.gender.toLowerCase(),
        height: Number(data.height),
        goal: data.goal,
        level: data.level,
        location: data.location,
        diet: data.diet,
        medical_condition: data.medical || "",
        notes: data.notes || "",
        stress_level: Number(data.stress),
      };

      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error || "Plan generation failed.");

      // ✅ Persist in session + local
      sessionStorage.setItem("aiPlan", JSON.stringify(result.data));
      localStorage.setItem("lastGeneratedPlan", JSON.stringify(result.data));

      router.push("/dashboard");
    } catch (error: any) {
      console.error("❌ Plan generation failed:", error);
      alert(error.message || "Something went wrong while generating your plan.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <GeneratingModal open={isGenerating} />

      <div
        className={`min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50 transition-colors ${
          isGenerating ? "pointer-events-none opacity-70" : ""
        }`}
      >
        <main className="flex-1 flex flex-col items-center py-16 px-4">
          <div className="w-full max-w-2xl space-y-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center">
              Let’s Personalize Your Fitness Plan
            </h1>

            <FormStepper currentStep={step} totalSteps={totalSteps} />

            <form onSubmit={handleSubmit(onSubmit)}>
              <Card className="p-8 mt-6 shadow-xl bg-white dark:bg-gray-900 border dark:border-gray-800">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-xl font-semibold mb-6">Basic Info</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Input label="Age" {...register("age")} />
                          {errors.age && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.age.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Select
                            label="Gender"
                            options={[
                              { value: "Male", label: "Male" },
                              { value: "Female", label: "Female" },
                              { value: "Other", label: "Other" },
                            ]}
                            value={watch("gender")}
                            onChange={(v) => setValue("gender", v)}
                            error={errors.gender?.message}
                          />
                        </div>

                        <div>
                          <Input label="Height (cm)" {...register("height")} />
                          {errors.height && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.height.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Input label="Weight (kg)" {...register("weight")} />
                          {errors.weight && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.weight.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end mt-8">
                        <Button onClick={handleNext}>Next →</Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-xl font-semibold mb-6">
                        Fitness & Lifestyle
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select
                          label="Fitness Goal"
                          options={[
                            { value: "Muscle Gain", label: "Muscle Gain" },
                            { value: "Weight Loss", label: "Weight Loss" },
                            { value: "Toning", label: "Toning" },
                            { value: "Endurance", label: "Endurance" },
                          ]}
                          value={watch("goal")}
                          onChange={(v) => setValue("goal", v)}
                          error={errors.goal?.message}
                        />

                        <Select
                          label="Fitness Level"
                          options={[
                            { value: "Beginner", label: "Beginner" },
                            { value: "Intermediate", label: "Intermediate" },
                            { value: "Advance", label: "Advance" },
                          ]}
                          value={watch("level")}
                          onChange={(v) => setValue("level", v)}
                          error={errors.level?.message}
                        />

                        <Select
                          label="Workout Location"
                          options={[
                            { value: "Home", label: "Home" },
                            { value: "Gym", label: "Gym" },
                            { value: "Outdoor", label: "Outdoor" },
                          ]}
                          value={watch("location")}
                          onChange={(v) => setValue("location", v)}
                          error={errors.location?.message}
                        />

                        <Select
                          label="Dietary Preference"
                          options={[
                            { value: "Veg", label: "Veg" },
                            { value: "Vegan", label: "Vegan" },
                            { value: "Keto", label: "Keto" },
                            { value: "Non-Veg", label: "Non-Veg" },
                          ]}
                          value={watch("diet")}
                          onChange={(v) => setValue("diet", v)}
                          error={errors.diet?.message}
                        />
                      </div>

                      <div className="flex justify-between mt-8">
                        <Button variant="secondary" onClick={handleBack}>
                          ← Back
                        </Button>
                        <Button onClick={handleNext}>Next →</Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-xl font-semibold mb-6">
                        Additional Preferences
                      </h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Textarea
                          label="Medical Conditions (optional)"
                          {...register("medical")}
                        />
                        <Textarea label="Any Notes" {...register("notes")} />

                        <div className="col-span-2">
                          <label className="text-sm font-medium">
                            Stress Level: {watch("stress")}
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            {...register("stress")}
                            className="w-full mt-2 accent-indigo-500"
                          />
                          {errors.stress && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.stress.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between mt-8">
                        <Button variant="secondary" onClick={handleBack}>
                          ← Back
                        </Button>
                        <Button type="submit" variant="primary">
                          Generate My AI Plan
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}
