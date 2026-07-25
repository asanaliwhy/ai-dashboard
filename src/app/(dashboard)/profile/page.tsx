"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, User, Key, Save, Mail, Calendar, Shield } from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setName(data.name || "");
          setEmail(data.email || "");
          if (data.createdAt) {
            setCreatedAt(new Date(data.createdAt).toLocaleDateString());
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update profile");
        return;
      }

      toast.success("Profile updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      toast.error("An error occurred while saving");
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

  const fallbackLetter = name.charAt(0).toUpperCase() || "U";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 text-primary font-medium text-xs tracking-wider uppercase mb-1">
          <User className="h-4 w-4" /> Account Overview
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Profile
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your personal details and security credentials.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Avatar & Info Card */}
        <Card className="border border-border/60 bg-card p-6 shadow-xs">
          <CardHeader className="p-0 pb-6 border-b border-border/40">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-xs">
                <AvatarImage src="" alt={name} />
                <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                  {fallbackLetter}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <CardTitle className="text-xl font-bold">{name || "User"}</CardTitle>
                <CardDescription className="text-xs">{email}</CardDescription>
                {createdAt && (
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 pt-1">
                    <Calendar className="h-3 w-3" /> Member since {createdAt}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 pt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" /> Full Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="h-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security / Password Card */}
        <Card className="border border-border/60 bg-card p-6 shadow-xs">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> Security & Password
            </CardTitle>
            <CardDescription className="text-xs">
              Update your account password. Leave fields blank if you do not wish to make changes.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 pt-2 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-xs font-semibold flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-muted-foreground" /> Current Password
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-xs font-semibold flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-muted-foreground" /> New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="•••••••• (min 8 characters)"
                  className="h-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={saving}
            className="gap-2 h-10 px-6 rounded-xl font-medium"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
