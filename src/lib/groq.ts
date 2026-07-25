import { createGroq } from "@ai-sdk/groq";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY!,
});

export const models = {
  "Llama 3.3": groq("llama-3.3-70b-versatile"),
  "GPT OSS 120B": groq("openai/gpt-oss-120b"),
} as const;

export type AIModel = keyof typeof models;