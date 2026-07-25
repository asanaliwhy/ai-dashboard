import { createGroq } from "@ai-sdk/groq";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export const models = {
  "Llama 3.3": groq("llama-3.3-70b-versatile"),
  "Llama 3.1 8B": groq("llama-3.1-8b-instant"),
  "Mixtral 8x7B": groq("mixtral-8x7b-32768"),
  "DeepSeek R1 70B": groq("deepseek-r1-distill-llama-70b"),
  "GPT OSS 120B": groq("llama-3.3-70b-versatile"), // Fallback to Llama 3.3 for legacy compatibility
} as const;

export type AIModel = keyof typeof models;