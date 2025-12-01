import * as openai from "./openai";
import * as gemini from "./geminiHandler";

const providers = {
  openai: openai,
  gemini: gemini,
};

const providerName = process.env.LLM_PROVIDER;

const selectedProvider = providers[providerName as keyof typeof providers];
if (!selectedProvider) {
  throw new Error(`Invalid LLM Provider: ${providerName}`);
}

export default selectedProvider;
