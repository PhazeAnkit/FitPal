// src/lib/openai.ts
import OpenAI from "openai";

export const openai = new OpenAI({
  baseURL: process.env.ENDPOINT,
  apiKey: process.env.OPENAI_API_KEY,
});

export const OPENAI_MODELS = {
  text: "gpt-4o",
  image: "dall-e-3",
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
  style = "vivid",
  quality = "standard",
}: {
  prompt: string;
  size?: "256x256" | "512x512" | "1024x1024";
  style?: "vivid" | "natural";
  quality?: "standard" | "hd";
}) {
  const endpoint = process.env.ENDPOINT1!;
  const apiKey = process.env.OPENAI_API_KEY1!;

  const url = endpoint

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`, 
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        size,
        style,
        quality,
        n: 1,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Azure Image Generation Error:", errText);
      throw new Error(`Azure image generation failed: ${response.statusText}`);
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url;

    console.log("Azure DALL·E 3 Image Generated:", imageUrl);
    return imageUrl;
  } catch (error: any) {
    console.error("Azure DALL·E 3 API Error:", error.message);
    return null;
  }
}

export async function generateAudio({
  text,
  voice = "alloy",
}: {
  text: string;
  voice?: "alloy" | "verse" | "sage" | "soft";
}): Promise<Buffer | null> {
  if (!text || text.trim().length === 0) {
    throw new Error("Text input required for audio generation");
  }

  const result = await safeOpenAIRequest(async () => {
    const response = await openai.audio.speech.create({
      model: OPENAI_MODELS.tts,
      voice,
      input: text,
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer;
  });

  return result;
}
