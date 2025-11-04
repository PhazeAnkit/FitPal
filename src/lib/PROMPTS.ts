export const PROMPT_VERSION = {
  fitnessPlan: "v1.0.0",
  recoveryTips: "v1.0.0",
  motivation: "v1.0.0",
  shoppingSummary: "v1.0.0",
  voiceMotivation: "v1.0.0",
};

export const PROMPTS = {
  fitnessPlan: (user: {
  age: number;
  weight: number;
  gender: "male" | "female" | "other";
  height: number;
  goal: 'Muscle Gain'| 'Weight Loss'| 'Toning'| 'Endurance';
  level: 'Beginner'| 'Intermediate'| 'Advance' ;
  location: 'Home'| 'Gym'| 'Outdoor';
  diet: 'Veg'| 'Vegan'| 'Keto'| 'Non-Veg';
  medical_condition?: string;
  notes?: string;
  stress_level: number;
  }) => `
You are an expert in human anatomy, physiology, exercise science, and nutrition.
Your task is to design a 7-day personalized exercise and diet plan based on the user’s provided data.

The response must be structured in valid JSON format, with no extra commentary or text outside the JSON.

User Input Parameters:
- Age: ${user.age}
- Gender: ${user.gender}
- Height: ${user.height} cm
- Weight: ${user.weight} kg
- Location: ${user.location}
- Fitness goal: ${user.goal}
- Fitness level: ${user.level}
- Dietary preference: ${user.diet}
- Medical conditions: ${user.medical_condition || "None"}
- Stress level: ${user.stress_level || 5}

Output JSON Structure (Mandatory):
{
  "user_profile": {
    "age": ${user.age || 0},
    "gender": "${user.gender}",
    "height_cm": ${user.height || 0},
    "weight_kg": ${user.weight || 0},
    "location": "${user.location}",
    "fitness_goal": ["${user.goal}"],
    "fitness_level": "${user.level}",
    "dietary_preference": "${user.diet}",
    "medical_conditions": ["${user.medical_condition || "None"}"],
    "stress_level": "${user.stress_level || 5}"
  },
  "targets": {
    "estimated_bmr_kcal": 0,
    "estimated_tdee_kcal": 0,
    "daily_calorie_target_kcal": 0,
    "macros": {
      "protein_g": 0,
      "fat_g": 0,
      "carbs_g": 0,
      "fiber_g": 0
    },
    "hydration_target_liters": 0,
    "daily_steps_min": 0
  },
  "weekly_overview": {
    "structure": "",
    "intensity_scale": "",
    "notes": [""]
  },
  "exercise_plan": {
    "day1": {
      "focus": "",
      "warm_up": "",
      "workout": [
        { "name": "", "sets": 0, "reps": "" }
      ],
      "cool_down": "",
      "duration_min": 0
    },
    "day2": {},
    "day3": {},
    "day4": {},
    "day5": {},
    "day6": {},
    "day7": {}
  },
  "diet_plan": {
    "daily_targets": {
      "calories_kcal": 0,
      "protein_g": 0,
      "fat_g": 0,
      "carbs_g": 0
    },
    "principles": [""],
    "day1": {
      "breakfast": "",
      "snack_am": "",
      "lunch": "",
      "snack_pm": "",
      "dinner": ""
    },
    "day2": {},
    "day3": {},
    "day4": {},
    "day5": {},
    "day6": {},
    "day7": {}
  },
  "hydration_sleep_recovery": {
    "hydration": [""],
    "sleep": [""],
    "recovery": [""],
    "stress_management": [""]
  },
  "shopping_list": {
    "protein": [""],
    "carbs_grains": [""],
    "fats": [""],
    "produce": [""],
    "spices_condiments": [""]
  },
  "safety_notes": [""],
  "progress_checks": {
    "weekly": [""],
    "performance": [""],
    "adjustments_after_2_weeks": [""]
  }
}

Instructions:
- Always ensure output is valid JSON (no markdown or extra text).
- Tailor all exercise and diet recommendations to the user’s inputs.
- Ensure safety — adapt for any medical conditions (e.g., hypertension, diabetes, injury).
- Include actionable hydration, sleep, and stress management tips.
- Calorie and macro estimates must be scientifically plausible based on user data.
- The tone should be clear, professional, and sustainable, avoiding unsafe or extreme measures.
- Output only the JSON object — do not include explanations, markdown, or text outside the JSON.
`,

  motivation: (userName?: string) => `
You are a positive, experienced fitness coach.
Write a short, powerful motivational quote for ${userName || "the user"}.
Make it 1-2 sentences only, clear, encouraging, and goal-focused.
Avoid clichés. Return plain text only.
`,

  recoveryTips: (level: string, stress: string) => `
You are a certified physiologist and mental wellness coach.
Suggest 3 concise recovery tips and 3 stress management practices for a ${level}-level person with ${stress} stress.
Return structured JSON like:
{
  "recovery_tips": ["", "", ""],
  "stress_management_tips": ["", "", ""]
}
`,

  shoppingSummary: (shoppingData: any) => `
You are a nutritionist preparing a concise grocery list.
Given the user's raw shopping list data below:
${JSON.stringify(shoppingData, null, 2)}

Summarize and categorize into JSON:
{
  "protein": [],
  "carbs_grains": [],
  "fats": [],
  "produce": [],
  "spices_condiments": []
}
Output valid JSON only.
`,

  voiceMotivation: (user: { name?: string; goal?: string; level?: string }) => `
You are an inspiring virtual fitness coach.
Generate a short (2–3 sentence) motivational voice script for ${
    user.name || "the user"
  }.
Focus on their goal: ${user.goal || "fitness improvement"} and level: ${
    user.level || "beginner"
  }.
Tone: energetic, supportive, confident.
Avoid text formatting — plain text output only.
`,
};
