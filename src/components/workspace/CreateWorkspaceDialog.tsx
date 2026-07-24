"use client";

import { useState } from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateWorkspaceForm } from "./CreateWorkspaceForm";

export function CreateWorkspaceDialog(){
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button variant="outline">Create Workspace</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Workspace</DialogTitle>
                </DialogHeader>
                <CreateWorkspaceForm onSuccess={() => setOpen(false)}/>
            </DialogContent>
        </Dialog>
    )
}