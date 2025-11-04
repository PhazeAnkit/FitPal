// src/lib/openai.ts
import OpenAI from "openai";


export const openai = new OpenAI({
  baseURL: process.env.ENDPOINT,
  apiKey: process.env.OPENAI_API_KEY
});


export const OPENAI_MODELS = {
  text: "gpt-4o",
  image: "gpt-image-1",
  tts: "gpt-4o-mini-tts",
};


export async function safeOpenAIRequest<T>(
  fn: () => Promise<T>
): Promise<T | null> {
  try {
    return await fn();
  } catch (error: any) {
    console.error("❌ OpenAI API Error:", error?.message || error);
    return null;
  }
}


export async function chatCompletion({
  prompt,
  model = OPENAI_MODELS.text,
  temperature = 0.7,
  json = false,
}: {
  prompt: string;
  model?: string;
  temperature?: number;
  json?: boolean;
}) {
  const result = await safeOpenAIRequest(async () => {
    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature,
      ...(json ? { response_format: { type: "json_object" } } : {}),
    });
    return response;
  });

  return result?.choices?.[0]?.message?.content ?? "";
}

export async function generateImage({
  prompt,
  size = "1024x1024",
}: {
  prompt: string;
  size?: "256x256" | "512x512" | "1024x1024";
}) {
  const result = await safeOpenAIRequest(async () => {
    const response = await openai.images.generate({
      model: OPENAI_MODELS.image,
      prompt,
      size,
    });
    return response.data[0].url;
  });

  return result;
}
