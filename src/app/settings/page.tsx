"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Moon, Sun, Trash2, RotateCcw, Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("General");
  const [isDark, setIsDark] = useState(false);
  const [voice, setVoice] = useState("Female (Default)");
  const [includeImages, setIncludeImages] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const voicePref = localStorage.getItem("voice");
    const includeImg = localStorage.getItem("includeImages");

    if (theme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
    if (voicePref) setVoice(voicePref);
    if (includeImg) setIncludeImages(includeImg === "true");
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem("voice", voice);
  }, [voice]);

  useEffect(() => {
    localStorage.setItem("includeImages", includeImages ? "true" : "false");
  }, [includeImages]);

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all saved data?")) {
      localStorage.clear();
      alert("All saved data cleared!");
      window.location.reload();
    }
  };

  const handleResetDefaults = () => {
    setIsDark(false);
    setVoice("Female (Default)");
    setIncludeImages(true);
    localStorage.setItem("theme", "light");
    localStorage.setItem("voice", "Female (Default)");
    localStorage.setItem("includeImages", "true");
    document.documentElement.classList.remove("dark");
    alert("Settings reset to default values!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50 transition-colors duration-500">
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-12">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-10">
          <Settings className="h-8 w-8 text-indigo-500" />
          <h1 className="text-4xl font-bold">Settings / Preferences</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <aside>
            <Card className="p-4 space-y-2 bg-white dark:bg-gray-900 border dark:border-gray-800 shadow-sm">
              {["General", "Audio & Voice", "Data Management"].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "primary" : "ghost"}
                  className={`w-full justify-start transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-indigo-100 dark:bg-indigo-800/40"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </Button>
              ))}
            </Card>
          </aside>

          <section className="md:col-span-2">
            <Card className="p-6 bg-white dark:bg-gray-900 border dark:border-gray-800 shadow-lg space-y-6 transition-all duration-500">
              {/* --- General Tab --- */}
              {activeTab === "General" && (
                <>
                  <h2 className="text-xl font-semibold">General</h2>

                  <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <Sun className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium">Light / Dark Mode</span>
                      <Moon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <Switch checked={isDark} onCheckedChange={setIsDark} />
                  </div>

                  <div className="pt-4">
                    <h3 className="font-semibold mb-2">Display Mode</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Adjust how your app looks and feels. Your preference will
                      be saved automatically.
                    </p>
                  </div>
                </>
              )}

              {activeTab === "Audio & Voice" && (
                <>
                  <h2 className="text-xl font-semibold mb-4">
                    Audio and Voice
                  </h2>
                  <div>
                    <Select
                      label="TTS Voice Selection"
                      options={[
                        {
                          value: "Female (Default)",
                          label: "Female (Default)",
                        },
                        { value: "Male", label: "Male" },
                        { value: "Neutral", label: "Neutral" },
                      ]}
                      value={voice}
                      onChange={setVoice}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Choose the voice type for AI text-to-speech feedback.
                    </p>
                  </div>
                </>
              )}

              {/* --- Data Management Tab --- */}
              {activeTab === "Data Management" && (
                <>
                  <h2 className="text-xl font-semibold mb-4">
                    Data Management
                  </h2>

                  <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                    <label className="font-medium">Include Images in PDF</label>
                    <Switch
                      checked={includeImages}
                      onCheckedChange={setIncludeImages}
                    />
                  </div>

                  <div className="pt-6 space-y-3">
                    <Button
                      variant="destructive"
                      className="w-full flex items-center justify-center space-x-2"
                      onClick={handleClearData}
                    >
                      <Trash2 className="h-5 w-5" />
                      <span>Clear All Saved Data</span>
                    </Button>

                    <Button
                      variant="secondary"
                      className="w-full flex items-center justify-center space-x-2"
                      onClick={handleResetDefaults}
                    >
                      <RotateCcw className="h-5 w-5" />
                      <span>Reset to Defaults</span>
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
