import { NextResponse } from "next/server";
import { generateAudioService } from "@/services/audio-service";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const audioBuffer = await generateAudioService(text);
    if (!audioBuffer) throw new Error("Audio generation failed");

    const audioArray = new Uint8Array(audioBuffer);

    return new Response(audioArray, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'inline; filename="speech.mp3"',
      },
    });
  } catch (err: any) {
    console.error("🎤 Audio generation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
