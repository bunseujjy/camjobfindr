"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { insertApplicant } from "@/features/applicant/db/applicant";
import type { ApplicantValues } from "@/features/applicant/schema/applicantSchema";
import type { ApplicantType } from "@/features/applicant/types/job_type";
import { removeFromSaved, savedJobs } from "@/features/job/db/job";
import type {
  JobPostingResponse,
  SavedJobType,
} from "@/features/job/types/jobsType";
import type { UserData } from "@/features/users/types/type";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Loader,
  BookmarkCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState, useEffect } from "react";
import { toast } from "sonner";
import type { SortOption } from "./JobSearch";

interface JobListingsProps {
  jobs: JobPostingResponse[];
  applicant: ApplicantType[];
  saved_jobs: SavedJobType[];
  user: UserData | null;
  onSortChange: (option: SortOption) => void;
  currentSort: SortOption;
}

export function JobListings({
  jobs,
  applicant,
  saved_jobs,
  user,
  onSortChange,
  currentSort,
}: JobListingsProps) {
  // Debug log the applicant data
  useEffect(() => {
    console.log("JobListings - Applicant Data:", applicant);
    console.log("JobListings - User Data:", user);
  }, [applicant, user]);

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No jobs found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  // Handle sort change
  const handleSortChange = (value: string) => {
    onSortChange(value as SortOption);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-muted-foreground">{jobs.length} jobs found</p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px] h-9 text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Most relevant</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="salary">Highest salary</SelectItem>
              <SelectItem value="expiring">Expiring soon</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {jobs.map((job) => (
        <JobCard
          key={job.job_posting?.id}
          job={job}
          applicant={applicant}
          saved_jobs={saved_jobs}
          user={user}
        />
      ))}
    </div>
  );
}

// Define a proper interface for the applied jobs storage structure
interface AppliedJobsStorage {
  [userId: string]: string[]; // Array of job IDs for each user
}

// Update the getAppliedJobsFromStorage function to return the proper type
const getAppliedJobsFromStorage = (): AppliedJobsStorage => {
  try {
    if (typeof window === "undefined") return {};
    const stored = localStorage.getItem("appliedJobs");
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    console.error("Error reading applied jobs from localStorage:", e);
    return {};
  }
};

const saveAppliedJobToStorage = (userId: string, jobId: string) => {
  if (typeof window === "undefined") return;

  try {
    const stored = localStorage.getItem("appliedJobs");
    const data = stored ? JSON.parse(stored) : {};

    if (!data[userId]) {
      data[userId] = [];
    }

    if (!data[userId].includes(jobId)) {
      data[userId].push(jobId);
    }

    localStorage.setItem("appliedJobs", JSON.stringify(data));
  } catch (e) {
    console.error("Error saving applied job to localStorage:", e);
  }
};

function JobCard({
  job,
  applicant,
  saved_jobs,
  user,
}: {
  job: JobPostingResponse;
  applicant: ApplicantType[];
  saved_jobs: SavedJobType[];
  user: UserData | null;
}) {
  const queryClient = useQueryClient();
  const [isApplying, setIsApplying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const jobId = job?.job_posting?.id || "";
  const userId = user?.id || "";

  // Check if job is applied from props initially
  const isAppliedFromProps = applicant.some(
    (app) => app.userId === userId && app.jobId === jobId
  );

  // Start with just the props data for initial render to avoid hydration mismatch
  const [isApplied, setIsApplied] = useState(isAppliedFromProps);
  const [appliedJobsStorage, setAppliedJobsStorage] =
    useState<AppliedJobsStorage>({});

  // Only access localStorage after component has mounted (client-side only)
  useEffect(() => {
    const storage = getAppliedJobsFromStorage();
    setAppliedJobsStorage(storage);

    const isAppliedFromStorage =
      storage[userId] && storage[userId].includes(jobId);

    if (isAppliedFromStorage) {
      setIsApplied(true);
    }
  }, [userId, jobId]);

  // Debug logs - only run on client
  useEffect(() => {
    console.log(`JobCard ${jobId} - Application Status:`, {
      jobId,
      userId,
      isAppliedFromProps,
      isAppliedFromStorage:
        appliedJobsStorage[userId] &&
        appliedJobsStorage[userId].includes(jobId),
      isApplied,
      applicantData: applicant.filter((app) => app.jobId === jobId),
      storageData: appliedJobsStorage[userId],
    });
  }, [
    jobId,
    userId,
    isAppliedFromProps,
    isApplied,
    applicant,
    appliedJobsStorage,
  ]);

  // Update storage if applied in props but not in storage
  useEffect(() => {
    const isAppliedFromStorage =
      appliedJobsStorage[userId] && appliedJobsStorage[userId].includes(jobId);

    if (isAppliedFromProps && !isAppliedFromStorage && userId && jobId) {
      saveAppliedJobToStorage(userId, jobId);
    }
  }, [isAppliedFromProps, appliedJobsStorage, userId, jobId]);

  const [isSaved, setIsSaved] = useState(
    saved_jobs?.some(
      (saved) => saved.userId === userId && saved.jobId === jobId
    )
  );

  const applyJob = async (data: ApplicantValues) => {
    if (isApplied) return;

    try {
      setIsApplying(true);

      // Check for resume first
      if (!data.resume[0]) {
        toast.error("You need to have a resume to apply for this job.");
        return; // Exit early
      }

      const response = await insertApplicant(data);

      if (response) {
        // Update local state
        setIsApplied(true);

        // Save to localStorage
        saveAppliedJobToStorage(userId, jobId);

        toast.success("You successfully applied for this job.");

        // Invalidate and refetch applicants data
        await queryClient.invalidateQueries({ queryKey: ["applicants"] });

        // Log success
        console.log("Successfully applied for job:", {
          jobId,
          userId,
          response,
        });
      }

      return response;
    } catch (error) {
      console.error("Failed to apply:", error);
      toast.error("Failed to apply for the job");
    } finally {
      setIsApplying(false);
    }
  };

  const saveJob = useCallback(
    async (userId: string, jobId: string) => {
      if (!userId || !jobId) {
        toast.error("Missing required information to save job");
        return;
      }

      try {
        setIsSaving(true);
        const newSavedState = !isSaved;
        setIsSaved(newSavedState);

        if (newSavedState) {
          // Adding to saved
          const response = await savedJobs(userId, jobId);
          if (!response) {
            throw new Error("Failed to save job");
          }
          toast.success("Job saved successfully");
        } else {
          // Removing from saved
          const success = await removeFromSaved(jobId);
          if (!success) {
            throw new Error("Failed to remove from saved jobs");
          }
          toast.success("Removed from saved jobs");
        }

        // Invalidate queries to sync with server
        await queryClient.invalidateQueries({ queryKey: ["savedJobs"] });
      } catch (error) {
        setIsSaved((prev) => !prev); // Revert on error
        toast.error(
          error instanceof Error ? error.message : "Operation failed"
        );
      } finally {
        setIsSaving(false);
      }
    },
    [queryClient, isSaved]
  );

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-shrink-0">
            <Image
              src={job.company?.logo || "/placeholder.svg"}
              alt={`${job.company} logo`}
              width={60}
              height={60}
              className="rounded-md"
            />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h3 className="font-semibold text-xl">
                {job.job_posting?.job_title}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="self-start md:self-auto"
                onClick={() => saveJob(userId, jobId)}
                disabled={isSaving}
              >
                {isSaved ? <BookmarkCheck /> : <Bookmark className="h-5 w-5" />}

                <span className="sr-only">Save job</span>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span>{job.job_posting?.company_name}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{job.job_posting?.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>{job.job_posting?.salary}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{job.job_posting?.createdAt.toString()}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary">{job.job_posting?.job_type}</Badge>
            </div>

            <div
              dangerouslySetInnerHTML={{ __html: job.job_posting?.description }}
              className="text-sm text-muted-foreground line-clamp-2 mt-2"
            ></div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/50 px-6 py-3 flex justify-between">
        <Link href={`/job/${job.job_posting?.id}`}>
          <Button variant="outline">View Details</Button>
        </Link>
        <Button
          size="lg"
          onClick={() =>
            applyJob({
              userId: userId,
              jobId: jobId,
              resume: user?.resume ?? "",
              status: "pending",
            })
          }
          disabled={isApplied || isApplying}
        >
          {isApplying ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Applying...
            </>
          ) : isApplied ? (
            "Applied"
          ) : (
            "Apply Now"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
