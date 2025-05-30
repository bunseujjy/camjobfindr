"use client";

import { useState } from "react";
import { Search, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ResumeData } from "@/features/resume/schema/resumeSchema";
import Link from "next/link";
import ResumeItem from "./ResumeItem";
import RenameModal from "./RenameModal";

interface ResumeListingProps {
  resumeData: ResumeData[];
}

export default function ResumeListingPage({ resumeData }: ResumeListingProps) {
  // Keep the original data in state so we can update it
  const [resumes, setResumes] = useState<ResumeData[]>(resumeData);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [isOpen, setIsOpen] = useState(false);

  // Filter resumes based on search query
  const filteredResumes = resumes.filter((resume) =>
    resume.general_info?.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Sort the filtered resumes
  const sortedResumes = [...filteredResumes].sort((a, b) => {
    if (sortBy === "recent") {
      return (
        new Date(b.updatedAt ?? "").getTime() -
        new Date(a.updatedAt ?? "").getTime()
      );
    } else if (sortBy === "title") {
      return (a.general_info?.title ?? "").localeCompare(
        b.general_info?.title ?? ""
      );
    }
    return 0;
  });

  // Update the state when a resume is deleted
  const handleResumeDeleted = (deletedId: string) => {
    setResumes((prevResumes) =>
      prevResumes.filter((resume) => resume.id !== deletedId)
    );
  };

  const handleResumeRenamed = (resumeId: string, newTitle: string) => {
    setResumes((prevResumes) =>
      prevResumes.map((resume) =>
        resume.id === resumeId
          ? {
              ...resume,
              general_info: {
                ...resume.general_info,
                title: newTitle,
              },
            }
          : resume
      )
    );
  };
  const handleDuplicateResume = async (resumeId: string) => {
    try {
      // 1. Find the original resume
      const originalResume = resumes.find((resume) => resume.id === resumeId);
      if (!originalResume) return;

      // 2. Create a duplicate with a new ID and "Copy" in title
      const duplicatedResume = {
        ...originalResume,
        id: crypto.randomUUID(), // Generate new ID
        general_info: {
          ...originalResume.general_info,
          title: `${originalResume.general_info?.title}`,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // 3. Optimistically update UI
      setResumes((prev) => [...prev, duplicatedResume]);
    } catch (error) {
      console.error("Failed to duplicate resume:", error);
      // Revert UI if database operation fails
      setResumes((prev) => prev.filter((resume) => resume.id !== resumeId));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Resumes</h1>
        <p className="text-muted-foreground">
          Manage and organize your professional resumes
        </p>
      </header>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your resumes..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-4 flex-wrap sm:flex-nowrap">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
            </SelectContent>
          </Select>

          <Link href="/new_resume">
            <Button className="flex gap-2">
              <Plus className="h-4 w-4" />
              Create New
            </Button>
          </Link>
        </div>
      </div>

      {sortedResumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center sm:justify-items-stretch ">
          {sortedResumes.map((resume) => (
            <div key={resume.id}>
              <ResumeItem
                resume={resume}
                isOpen={isOpen}
                onResumeDeleted={handleResumeDeleted}
                onDuplicateResume={handleDuplicateResume}
                className="w-full max-w-[350px] sm:max-w-none"
                setIsOpen={setIsOpen}
              />
              <div>
                {isOpen && (
                  <RenameModal
                    isOpen={isOpen}
                    onClose={setIsOpen}
                    onEdit={handleResumeRenamed}
                    resumeId={resume?.id}
                    currentTitle={resume?.general_info?.title}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No resumes found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "No resumes match your search criteria"
              : "Create your first resume to get started"}
          </p>
          <Link href="/new_resume">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Resume
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
