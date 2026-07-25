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

type WorkspaceFile = {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  createdAt: string | Date;
};

type FileUploadSectionProps = {
  workspaceId: string;
  initialFiles: WorkspaceFile[];
};

export function FileUploadSection({
  workspaceId,
  initialFiles,
}: FileUploadSectionProps) {
  const [files, setFiles] = useState<WorkspaceFile[]>(initialFiles);
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleAddFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim() || !fileUrl.trim()) return;

    try {
      setUploading(true);
      const res = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fileName,
          url: fileUrl,
          workspaceId,
          size: Math.floor(Math.random() * 500000) + 10000,
          type: "document",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to attach file");
        return;
      }

      toast.success("File added to workspace context");
      setFiles([data, ...files]);
      setFileName("");
      setFileUrl("");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const res = await fetch(`/api/files?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");

      setFiles(files.filter((f) => f.id !== id));
      toast.success("File removed from workspace");
      router.refresh();
    } catch {
      toast.error("Could not delete file");
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Workspace Files (RAG Context)
          </CardTitle>
          <CardDescription>
            Attach knowledge sources and documents for AI contextual retrieval.
          </CardDescription>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Add File
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Attach Document for RAG</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddFile} className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-medium">Document Name</label>
                <Input
                  placeholder="e.g., API Reference, Project Spec.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium">Resource URL or File Path</label>
                <Input
                  placeholder="https://example.com/doc.pdf"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
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

      <CardContent>
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl text-center">
            <FileIcon className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm font-medium">No files attached yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add documents to provide memory and context to AI chats in this workspace.
            </p>
          </div>
        ) : (
          <div className="divide-y rounded-lg border">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileIcon className="h-4 w-4" />
                  </div>
                  <div className="truncate">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium hover:underline truncate block"
                    >
                      {file.name}
                    </a>
                    <span className="text-muted-foreground">
                      {formatBytes(file.size)} • Added{" "}
                      {new Date(file.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:bg-destructive/10"
                  disabled={deletingId === file.id}
                  onClick={() => handleDelete(file.id)}
                >
                  {deletingId === file.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
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
