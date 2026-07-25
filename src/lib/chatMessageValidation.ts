import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(4000, "Message is too long"),

  chatId: z.string().cuid(),
});

export type MessageSchema = z.infer<typeof messageSchema>;