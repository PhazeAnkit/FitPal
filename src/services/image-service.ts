import provider from "@/lib/llm-handler";
import { PROMPTS } from "@/lib/PROMPTS";

export async function generateImageService(exerciseData: any) {
  if (!exerciseData || !exerciseData.name) {
    throw new Error("Invalid exercise data");
  }

  const prompt = PROMPTS.exerciseImage(exerciseData);

  const imageUrl = await provider.generateImage({
    prompt,
    size: "1024x1024",
  });

  if (!imageUrl) {
    throw new Error("Failed to generate image from OpenAI");
  }

  return {
    url: imageUrl.image,
    prompt,
    exerciseData,
  };
}
