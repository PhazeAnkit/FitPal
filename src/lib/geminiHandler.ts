import { GoogleGenAI } from "@google/genai";
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const GEMINI_MODELS = {
  text: "gemini-2.5-flash",
  image: "gemini-2.5-flash-image",
};

async function safeAIRequest<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (error: any) {
    console.error("❌ OpenAI API Error:", error?.message || error);
    return null;
  }
}

export async function chatCompletion({
  prompt,
  model = GEMINI_MODELS.text,
  temperature = 0.7,
}: {
  prompt: string;
  model?: string;
  temperature?: number;
}) {
  const config = {
    temperature: temperature,
    responseMimeType: "application/json",
  };
  const result = await safeAIRequest(async () => {
    const response = await genAI.models.generateContent({
      model: model,
      config,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    return response;
  });

  return result?.text;
}

export async function generateImage({ prompt }: { prompt: string }) {
  const config = {
    imageConfig: {
      aspectRatio: "16:9",
    },
  };
  const result = await safeAIRequest(async () => {
    return await genAI.models.generateContent({
      model: GEMINI_MODELS.image,
      config,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    });
  });

  const parts = result?.candidates?.[0]?.content?.parts || [];

  const imagePart = parts.find((p): p is { inlineData: { data: string } } =>
    Boolean(p.inlineData?.data)
  );

  if (!imagePart) {
    throw new Error("No image returned from Gemini API");
  }

  return {
    image: imagePart.inlineData.data,
    success: true,
  };
}
