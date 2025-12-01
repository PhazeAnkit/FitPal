import { NextResponse } from "next/server";
import { generateImage } from "@/lib/geminiHandler";
import { PROMPTS } from "@/lib/PROMPTS";

export async function POST(req: Request) {
  try {
    const { exerciseData } = await req.json();

    if (!exerciseData?.name) {
      return NextResponse.json(
        { success: false, error: "Invalid exercise data" },
        { status: 400 }
      );
    }

    const prompt = PROMPTS.exerciseImage(exerciseData);

    const result = await generateImage({ prompt });

    if (!result?.image || !result.success) {
      return NextResponse.json(
        { success: false, error: "No image generated" },
        { status: 500 }
      );
    }

    // ✅ Convert base64 into a browser-usable image URL
    const dataUrl = `data:image/png;base64,${result.image}`;

    return NextResponse.json({
      success: true,
      url: dataUrl, // ✅ This is what your frontend expects and <img/> can display
      prompt,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
