import { NextResponse } from "next/server";
import { generateImageService } from "@/services/image-service";

export async function POST(req: Request) {
  try {
    const { exerciseData } = await req.json();

    if (!exerciseData) {
      return NextResponse.json(
        { success: false, error: "Missing exercise data" },
        { status: 400 }
      );
    }

    const imageResult = await generateImageService(exerciseData);

    return NextResponse.json({
      success: true,
      ...imageResult, 
    });
  } catch (error: any) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Image generation failed" },
      { status: 500 }
    );
  }
}
