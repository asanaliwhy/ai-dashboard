"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AI_MODELS } from "@/lib/chatValidation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Laptop, Save, Loader2, Sparkles, SlidersHorizontal, Bell } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [defaultModel, setDefaultModel] = useState<string>("Llama 3.3");
  const [theme, setTheme] = useState<"LIGHT" | "DARK" | "SYSTEM">("SYSTEM");
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.defaultModel) setDefaultModel(data.defaultModel);
          if (data.theme) setTheme(data.theme);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleThemeChange = (newTheme: "LIGHT" | "DARK" | "SYSTEM") => {
    setTheme(newTheme);
    const root = document.documentElement;
    if (newTheme === "DARK") {
      root.classList.add("dark");
    } else if (newTheme === "LIGHT") {
      root.classList.remove("dark");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ defaultModel, theme }),
      });

      if (!res.ok) {
        throw new Error("Failed to save settings");
      }

      toast.success("Settings saved successfully!");
    } catch {
      toast.error("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 text-primary font-medium text-xs tracking-wider uppercase mb-1">
          <SlidersHorizontal className="h-4 w-4" /> Preferences
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your default AI model options, interface theme, and notification preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* AI Model Preferences */}
        <Card className="border border-border/60 bg-card p-6 shadow-xs">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> AI Model Preferences
            </CardTitle>
            <CardDescription className="text-xs">
              Choose the default model automatically assigned to new workspace conversations.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="space-y-2 max-w-md">
              <Label htmlFor="default-model" className="text-xs font-semibold">
                Default AI Model
              </Label>
              <Select
                value={defaultModel}
                onValueChange={(val) => val && setDefaultModel(val)}
              >
                <SelectTrigger id="default-model" className="h-10">
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent>
                  {AI_MODELS.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Theme */}
        <Card className="border border-border/60 bg-card p-6 shadow-xs">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-bold">Appearance</CardTitle>
            <CardDescription className="text-xs">
              Select your preferred color mode for the AI Workspace interface.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="grid grid-cols-3 gap-4 max-w-md">
              <button
                type="button"
                onClick={() => handleThemeChange("LIGHT")}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  theme === "LIGHT"
                    ? "border-primary bg-primary/5 text-primary font-semibold shadow-xs"
                    : "border-border/60 hover:bg-accent hover:border-border text-muted-foreground"
                }`}
              >
                <Sun className="h-5 w-5" />
                <span className="text-xs">Light</span>
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange("DARK")}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  theme === "DARK"
                    ? "border-primary bg-primary/5 text-primary font-semibold shadow-xs"
                    : "border-border/60 hover:bg-accent hover:border-border text-muted-foreground"
                }`}
              >
                <Moon className="h-5 w-5" />
                <span className="text-xs">Dark</span>
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange("SYSTEM")}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  theme === "SYSTEM"
                    ? "border-primary bg-primary/5 text-primary font-semibold shadow-xs"
                    : "border-border/60 hover:bg-accent hover:border-border text-muted-foreground"
                }`}
              >
                <Laptop className="h-5 w-5" />
                <span className="text-xs">System</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border border-border/60 bg-card p-6 shadow-xs">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" /> Notifications
            </CardTitle>
            <CardDescription className="text-xs">
              Manage system updates and workspace alerts.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Email Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Receive activity summaries and system updates.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="gap-2 h-10 px-6 rounded-xl font-medium"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
