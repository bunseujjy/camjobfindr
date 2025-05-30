"use client";

import {
  JobPostingResponse,
  SavedJobType,
} from "@/features/job/types/jobsType";
import {
  BuildingIcon,
  MapPinIcon,
  BriefcaseIcon,
  TagIcon,
  DollarSignIcon,
  CalendarIcon,
  ClockIcon,
  Loader,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatDate } from "@/helper/formatDate";
import { ApplicantValues } from "@/features/applicant/schema/applicantSchema";
import { insertApplicant } from "@/features/applicant/db/applicant";
import { toast } from "sonner";
import { useState, useCallback } from "react";
import { ApplicantType } from "@/features/applicant/types/job_type";
import { savedJobs } from "@/features/job/db/job";
import { useQueryClient } from "@tanstack/react-query";

interface JobHeaderProps {
  job: JobPostingResponse | undefined;
  data: {
    userId: string | undefined;
    jobId: string | undefined;
    resume: string | null | undefined;
    status: ["pending", "interviewing", "rejected"];
  };
  applicant: ApplicantType[];
  saved_jobs: SavedJobType[];
}

const JobHeader = ({ job, data, applicant, saved_jobs }: JobHeaderProps) => {
  const queryClient = useQueryClient();
  const [isApplying, setIsApplying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isApplied = applicant.some(
    (app) => app.userId === data.userId && app.jobId === job?.job_posting?.id
  );
  const [isSaved, setIsSaved] = useState(
    saved_jobs?.some(
      (saved) =>
        saved.userId === data.userId && saved.jobId === job?.job_posting?.id
    )
  );

  const applyJob = async (data: ApplicantValues) => {
    try {
      setIsApplying(true);
      // Check for resume first
      if (!data.resume[0]) {
        toast.error("You need to have a resume to apply for this job.");
        return; // Exit early
      }
      const response = await insertApplicant(data);

      if (response) {
        toast.success("You successfully applied for this job.");
        // Invalidate and refetch applicants data
        await queryClient.invalidateQueries({ queryKey: ["applicants"] });
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
        const data = await savedJobs(userId, jobId);

        if (data && data.length > 0) {
          setIsSaved(true);
          // Invalidate and refetch saved jobs data
          await queryClient.invalidateQueries({ queryKey: ["savedJobs"] });
          toast.success("Successfully saved this job");
        } else {
          toast.error("Failed to save the job");
        }
      } catch (error) {
        console.error("Error saving job:", error);
        toast.error("There was an error saving this job");
        setIsSaved(false);
      } finally {
        setIsSaving(false);
      }
    },
    [queryClient]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{job?.job_posting.job_title}</h1>
          <div className="flex items-center mt-2 text-muted-foreground">
            <BuildingIcon className="h-4 w-4 mr-1" />
            <span>{job?.job_posting?.company_name}</span>
          </div>
        </div>
        <Image
          src={job?.company?.logo || "/placeholder.svg?height=80&width=80"}
          alt={`${job?.job_posting?.company_name} logo`}
          width={100}
          height={100}
          className="size-18 rounded-md object-contain"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="flex items-center gap-1">
          <MapPinIcon className="h-3 w-3" />
          {job?.job_posting?.location}
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          <BriefcaseIcon className="h-3 w-3" />
          {job?.job_posting?.job_type}
        </Badge>
        {job?.job_posting?.industry && (
          <Badge variant="outline" className="flex items-center gap-1">
            <TagIcon className="h-3 w-3" />
            {job?.job_posting?.industry}
          </Badge>
        )}
        {job?.job_posting?.salary && (
          <Badge variant="outline" className="flex items-center gap-1">
            <DollarSignIcon className="h-3 w-3" />
            {job?.job_posting?.salary}
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>
            Posted: {formatDate(job?.job_posting?.createdAt.toString())}
          </span>
        </div>
        {job?.job_posting?.expiresAt && (
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>
              Expires: {formatDate(job?.job_posting?.expiresAt.toString())}
            </span>
          </div>
        )}
        {job?.job_posting?.available && (
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>Available: {job?.job_posting?.available}</span>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-4">
        <Button
          size="lg"
          onClick={() =>
            applyJob({
              userId: data?.userId ?? "",
              jobId: data?.jobId ?? "",
              resume: data?.resume ?? "",
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
        <Button
          variant="outline"
          size="lg"
          onClick={() => saveJob(data?.userId ?? "", data?.jobId ?? "")}
          disabled={isSaving || isSaved}
        >
          {isSaving ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isSaved ? (
            "Saved"
          ) : (
            "Save Job"
          )}
        </Button>
      </div>
    </div>
  );
};

export default JobHeader;

export { JobHeader };
