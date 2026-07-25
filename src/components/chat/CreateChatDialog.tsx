"use client";

import { useState } from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateChatForm } from "@/components/chat/CreateChatForm";

type CreateChatDialogProps = {
  workspaceId: string;
};

export function CreateChatDialog({
  workspaceId,
}: CreateChatDialogProps){
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button variant="outline">Create Chat</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Chat</DialogTitle>
                </DialogHeader>
                <CreateChatForm workspaceId={workspaceId} onSuccess={() => setOpen(false)}/>
            </DialogContent>
        </Dialog>
    )
}