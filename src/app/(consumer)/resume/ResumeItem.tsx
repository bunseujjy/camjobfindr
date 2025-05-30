"use client";

import type { ResumeData } from "@/features/resume/schema/resumeSchema";
import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import ResumePreview from "@/features/resume/db/component/ResumePreview";
import { mapToResumeValues } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Download,
  Edit,
  Eye,
  FileText,
  Loader2,
  MoreHorizontal,
  Share2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  deleteResume,
  duplicateResume,
} from "@/features/resume/db/action/action";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/features/resume/type/resumeType";

interface ResumeItemProps {
  resume: ResumeData;
  className?: string;
  onResumeDeleted?: (id: string) => void; // Add callback prop
  onDuplicateResume?: (id: string) => void; // Add callback prop
  isOpen?: boolean;
  setIsOpen: (data: boolean) => void;
}

const ResumeItem = ({
  resume,
  className,
  onResumeDeleted,
  onDuplicateResume,
  isOpen,
  setIsOpen,
}: ResumeItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: resume.title || "Resume",
  });

  const onDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      if (id) {
        const result = await deleteResume(id);

        if (result) {
          toast.success("Resume deleted successfully");

          // Call the callback to update parent component state
          if (onResumeDeleted) {
            onResumeDeleted(id);
          }
        } else {
          toast.error("Failed to delete this resume");
        }
      } else {
        toast.error("Failed to delete this resume");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const onDuplicate = async (resume: ResumeValues, id: string) => {
    try {
      const duplicate = await duplicateResume(resume);

      if (duplicate) {
        toast.success("Successfully duplicated resume");

        if (onDuplicateResume) {
          onDuplicateResume(id);
        }
      } else {
        toast.error("Failed to duplicated this resume");
      }
    } catch (error) {
      console.error("Failed to duplicated this resume", error);
    }
  };
  return (
    <Card
      className={cn(
        "w-full overflow-hidden transition-all duration-300 hover:shadow-lg border border-border/40 group bg-card",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative bg-background border-b overflow-hidden h-[280px]">
        <div className="absolute inset-0 flex items-center justify-center p-3">
          <div className="w-full h-full relative bg-white rounded-sm shadow-sm overflow-hidden">
            <ResumePreview
              formData={mapToResumeValues(resume)}
              className="absolute inset-0 w-full h-full transform-gpu"
              contentRef={contentRef}
            />
          </div>
        </div>

        <div
          className={cn(
            "absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 transition-all duration-300",
            isHovering ? "opacity-100" : "opacity-0 sm:opacity-0",
            "sm:flex-row z-10"
          )}
        >
          <Button
            variant="secondary"
            size="sm"
            className="w-28 transition-transform hover:scale-105"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>

          <Link href={`/new_resume?resumeId=${resume.id}`}>
            <Button
              size="sm"
              className="w-28 transition-transform hover:scale-105"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      <CardContent className="p-4 sm:p-5">
        <div className="mb-2 sm:mb-3">
          <h3 className="font-semibold text-base sm:text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {resume.general_info?.title || "Untitled Resume"}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
            {resume.general_info?.description || "No description"}
          </p>
        </div>

        <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
          <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">
            Updated{" "}
            {new Date(resume.updatedAt ?? "").toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-3 sm:p-4 pt-0 flex justify-between items-center">
        <div className="flex gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="icon"
            title="Download"
            onClick={() => reactToPrintFn()}
            className="h-8 w-8 sm:h-9 sm:w-9 transition-all hover:bg-primary hover:text-primary-foreground"
          >
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            title="Share"
            className="h-8 w-8 sm:h-9 sm:w-9 transition-all hover:bg-primary hover:text-primary-foreground"
          >
            <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9 transition-all hover:bg-muted"
            >
              <MoreHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() =>
                onDuplicate(resume as ResumeValues, resume.id ?? "")
              }
            >
              <FileText className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Rename Resume
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive cursor-pointer focus:text-destructive-foreground focus:bg-destructive/10"
              onClick={() => onDelete(resume.id ?? "")}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default ResumeItem;
