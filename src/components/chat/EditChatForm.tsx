"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateChatSchema, AI_MODELS } from "@/lib/chatValidation";
import type { UpdateChatSchema } from "@/lib/chatValidation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EditChatFormProps = {
  chat: {
    id: string;
    title: string;
    aiModel: string;
  };
  onSuccess: () => void;
};

export function EditChatForm({
  chat,
  onSuccess,
}: EditChatFormProps) {
  const router = useRouter();

  const form = useForm<UpdateChatSchema>({
    resolver: zodResolver(updateChatSchema),
    defaultValues: {
      title: chat.title,
      aiModel: (AI_MODELS as readonly string[]).includes(chat.aiModel)
        ? (chat.aiModel as UpdateChatSchema["aiModel"])
        : "Llama 3.3",
    },
  });

  async function onSubmit(values: UpdateChatSchema) {
    try {
      const response = await fetch(`/api/chat/${chat.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to update chat");
        return;
      }

      toast.success("Chat updated");

      form.reset(values);
      onSuccess();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <Form {...form}>
      <form
        className="space-y-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chat title</FormLabel>

              <FormControl>
                <Input
                  placeholder="My Chat"
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aiModel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Model</FormLabel>

              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_MODELS.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              onSuccess();
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            Update Chat
          </Button>
        </div>
      </form>
    </Form>
  );
}