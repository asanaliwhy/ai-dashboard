"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createChatSchema, AI_MODELS } from "@/lib/chatValidation";
import type { CreateChatSchema } from "@/lib/chatValidation";
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

type CreateChatFormProps = {
  workspaceId: string;
  onSuccess: () => void;
};

export function CreateChatForm({
  workspaceId,
  onSuccess,
}: CreateChatFormProps) {
  const router = useRouter();

  const form = useForm<CreateChatSchema>({
    resolver: zodResolver(createChatSchema),
    defaultValues: {
      title: "",
      aiModel: "Llama 3.3",
      workspaceId,
    },
  });

  async function onSubmit(values: CreateChatSchema) {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to create chat");
        return;
      }

      toast.success("Chat created");

      form.reset();
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
            Create Chat
          </Button>
        </div>
      </form>
    </Form>
  );
}