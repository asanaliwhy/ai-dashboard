"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workspaceSchema } from "@/lib/workspaceValidation";
import type { Workspace } from "@/lib/workspaceValidation";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type CreateWorkspaceFormProps = {
  onSuccess: () => void;
};

const colors = [
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

export function CreateWorkspaceForm({
  onSuccess,
}: CreateWorkspaceFormProps) {
  const router = useRouter();

  const form = useForm<Workspace>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#2563eb",
    },
  });

  async function onSubmit(values: Workspace) {
    try {
      const response = await fetch("/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to create workspace");
        return;
      }

      toast.success("Workspace created");

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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace name</FormLabel>

              <FormControl>
                <Input
                  placeholder="My Workspace"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>

              <FormControl>
                <Input
                  placeholder="Optional"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>

              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => field.onChange(color)}
                    className={`h-8 w-8 rounded-md border-2 ${
                      field.value === color
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            Create Workspace
          </Button>
        </div>
      </form>
    </Form>
  );
}