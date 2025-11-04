import { NextResponse } from "next/server";
import { z } from "zod";
import { generatePlanService } from "@/services/plan-service";

const formSchema = z.object({
  age: z.number(),
  weight: z.number(),
  gender: z.enum(["male", "female", "other"]),
  height: z.number(),
  goal: z.enum(["Muscle Gain", "Weight Loss", "Toning", "Endurance"]),
  level: z.enum(["Beginner", "Intermediate", "Advance"]),
  location: z.enum(["Home", "Gym", "Outdoor"]),
  diet: z.enum(["Veg", "Vegan", "Keto", "Non-Veg"]),
  medical_condition: z.string().optional(),
  notes: z.string().optional(),
  stress_level: z.number(),
});


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = formSchema.parse(body); 

    const plan = await generatePlanService(data); 

    return NextResponse.json({ success: true, data: plan });
  } catch (error) {
    console.error(" Plan generation failed:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
