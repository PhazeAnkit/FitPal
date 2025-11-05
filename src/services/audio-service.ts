import { generateAudio } from "@/lib/openai";

export async function generateAudioService(text: string) {
  const audioBuffer = await generateAudio({ text, voice: "alloy" });
  return audioBuffer;
}
