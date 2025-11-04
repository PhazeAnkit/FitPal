import { chatCompletion } from "@/lib/openai";
import { PROMPTS } from "@/lib/PROMPTS";

export interface UserData {
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
}

export async function generatePlanService(userData: UserData) {
  const prompt = PROMPTS.fitnessPlan(userData);
  const result = await chatCompletion({
    prompt,
    json: true,
  });

  return JSON.parse(result || "{}");
}
