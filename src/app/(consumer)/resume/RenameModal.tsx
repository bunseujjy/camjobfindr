"use client";

import type * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { renameResume } from "@/features/resume/db/action/action";
import { toast } from "sonner";

interface RenameModalProps {
  isOpen: boolean;
  onClose: (data: boolean) => void;
  resumeId?: string;
  currentTitle?: string;
  onEdit: (resumeId: string, newTitle: string) => void;
}

const RenameModal = ({
  isOpen,
  onClose,
  resumeId,
  currentTitle = "",
  onEdit,
}: RenameModalProps) => {
  const [title, setTitle] = useState(currentTitle);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await renameResume(resumeId ?? "", title);
      onClose(!isOpen);
      if (onEdit) {
        onEdit(resumeId ?? "", title ?? "");
      }
      toast("Successfully renaming your resume");
    } catch (error) {
      console.error("Error renaming resume:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => onClose(!isOpen)}
      />

      {/* Modal */}
      <Card className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[500px] shadow-lg z-50">
        <CardHeader>
          <CardTitle>Rename your resume</CardTitle>
          <CardDescription>
            Change the title of your resume to something more descriptive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Resume Title</Label>
                <Input
                  id="name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a new title for your resume"
                  autoFocus
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => onClose(!isOpen)}
            type="button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default RenameModal;
