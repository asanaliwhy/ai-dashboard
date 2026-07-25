import { z } from "zod";

export const AI_MODELS = [
  "Llama 3.3",
  "Llama 3.1 8B",
  "Mixtral 8x7B",
  "DeepSeek R1 70B",
  "GPT OSS 120B",
] as const;

export const createChatSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters"),

  workspaceId: z.string().min(1),

  aiModel: z.enum(AI_MODELS),
});

export const updateChatSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters"),

  aiModel: z.enum(AI_MODELS),
});

export const chatSchema = createChatSchema;

export type CreateChatSchema = z.infer<typeof createChatSchema>;
export type UpdateChatSchema = z.infer<typeof updateChatSchema>;
export type ChatSchema = CreateChatSchema;