"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";



export default function LandingPage() {
  const { theme, setTheme } = useTheme();

  const handleScrollToDemo = () => {
    document.getElementById("demo-preview")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50 transition-colors duration-300">
      

      <main className="flex-1 container mx-auto px-6 py-20 space-y-24 max-w-6xl">

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden"
        >
          <div className="rounded-3xl p-8 md:p-16 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200/50 dark:border-indigo-800/50 shadow-xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4">
                  Your Personal <span className="text-indigo-600 dark:text-indigo-400">AI Fitness Coach</span> 
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
                  Get tailored workouts, diet plans, and motivation powered by AI — your smart way to stay fit.
                </p>

                <div className="flex gap-4">
                  <Link href="/form">
                    <Button variant="primary" size="lg" className="text-lg shadow-lg hover:shadow-xl">
                      Get Started →
                    </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleScrollToDemo}
                    className="text-lg"
                  >
                    Watch Demo →
                  </Button>
                </div>
              </div>

              {/* Hero Illustration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="hidden md:flex justify-end"
              >
                <img
                  src="/images/fitness-hero.svg"
                  alt="AI Fitness Coach"
                  className="max-w-md w-full drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* 2️⃣ Features Section */}
        <motion.section
          id="features"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-12"
        >
          <h2 className="text-4xl font-bold">Features That Drive Results</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: "🏋️",
                title: "AI Workout Plans",
                desc: "Personalized routines built around your goals and fitness level.",
              },
              {
                icon: "🥗",
                title: "Smart Diet Planning",
                desc: "Meals customized for your lifestyle and preferences.",
              },
              {
                icon: "🎧",
                title: "Voice & Visual Coach",
                desc: "Listen to your AI coach or see exercises in real-time.",
              },
            ].map((feature) => (
              <Card
                key={feature.title}
                className="p-8 text-center transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* 3️⃣ Demo Section */}
        <motion.section
          id="demo-preview"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8 py-16 border-t border-gray-200 dark:border-gray-800"
        >
          <h2 className="text-3xl font-bold">Experience the Future of Fitness</h2>
          <Card className="p-10 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-8">
            <div className="md:w-1/2 text-left space-y-4">
              <h3 className="text-2xl font-semibold">Interactive & Engaging Coaching</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Watch how AI adapts to your performance, nutrition, and progress. Stay motivated with a hands-free voice coach during your workouts.
              </p>
              <Link href="/form">
                <Button variant="primary" className="mt-4">Try It Now →</Button>
              </Link>
            </div>

            <div className="md:w-1/2 flex justify-center">
              <div className="h-52 w-full max-w-sm bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-medium shadow-inner">
                [Demo Preview Animation Placeholder]
              </div>
            </div>
          </Card>
        </motion.section>

        {/* 4️⃣ Call to Action */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6 py-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your Fitness Journey?</h2>
          <Link href="/form">
            <Button variant="primary" size="lg" className="px-10 py-4 text-lg shadow-lg hover:shadow-2xl">
              Start Now →
            </Button>
          </Link>
        </motion.section>
      </main>

    </div>
  );
}
