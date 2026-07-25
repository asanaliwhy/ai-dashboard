"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Trash2, File as FileIcon, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type FileItem = {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  createdAt: Date | string;
};

type FileUploadSectionProps = {
  workspaceId: string;
  initialFiles: FileItem[];
};

export function FileUploadSection({
  workspaceId,
  initialFiles,
}: FileUploadSectionProps) {
  const router = useRouter();
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAddFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim() || !fileUrl.trim()) return;

    try {
      setUploading(true);
      const res = await fetch(`/api/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          name: fileName,
          url: fileUrl,
          size: 1024 * 50, // default placeholder size 50KB
          type: "application/pdf",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to attach file");
        return;
      }

      toast.success("Document attached to workspace context");
      setFiles((prev) => [data, ...prev]);
      setFileName("");
      setFileUrl("");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      setDeletingId(fileId);
      const res = await fetch(`/api/files?id=${fileId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Failed to remove file");
        return;
      }

      toast.success("File removed from context");
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <Card className="border border-border/60 bg-card p-6 shadow-xs">
      <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between border-b border-border/40">
        <div>
          <CardTitle className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> Workspace Files (RAG Context)
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Attach knowledge sources and documents for AI contextual retrieval.
          </CardDescription>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-3 text-xs font-medium hover:bg-accent transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add File
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold tracking-tight">
                Attach Document for RAG
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddFile} className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold">Document Name</label>
                <Input
                  placeholder="e.g., API Reference, Project Spec.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  required
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold">Resource URL or File Path</label>
                <Input
                  placeholder="https://example.com/doc.pdf"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  required
                  className="h-10"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="h-9 px-4 rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading} className="h-9 px-4 rounded-xl text-xs font-medium">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Upload className="h-4 w-4 mr-1" />
                  )}
                  Attach File
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="p-0 pt-4">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border/60 rounded-2xl text-center bg-muted/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
              <FileIcon className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-foreground">No files attached yet</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Add documents to provide memory and context to AI chats in this workspace.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/40 rounded-xl border border-border/60 overflow-hidden">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 px-4 text-xs hover:bg-accent/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-medium shadow-xs">
                    <FileIcon className="h-4 w-4" />
                  </div>
                  <div className="truncate">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium hover:underline text-foreground truncate block"
                    >
                      {file.name}
                    </a>
                    <span className="text-[11px] text-muted-foreground">
                      {formatBytes(file.size)} • Added{" "}
                      {new Date(file.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-lg"
                  disabled={deletingId === file.id}
                  onClick={() => handleDelete(file.id)}
                  title="Remove document"
                >
                  {deletingId === file.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
