"use client";

import React, { useCallback, useState, useEffect } from "react";
import { JobType } from "./types";
import { Bookmark, Loader, MapPin } from "lucide-react";
import { formatDate } from "@/helper/formatDate";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { extractCompanyName } from "@/helper/extractCompanyName";
import { useRouter } from "next/navigation";
import { ApplicantValues } from "@/features/applicant/schema/applicantSchema";
import { insertApplicant } from "@/features/applicant/db/applicant";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const JobCard = ({ job_db, feature_jobs, user, isApplied }: JobType) => {
  const queryClient = useQueryClient();
  const { companyName, logoUrl } = extractCompanyName(
    feature_jobs?.content_html
  );
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [localIsApplied, setLocalIsApplied] = useState(isApplied);
  const router = useRouter();

  // Update localIsApplied when isApplied prop changes
  useEffect(() => {
    setLocalIsApplied(isApplied);
  }, [isApplied]);

  const quickApply = useCallback(
    async (data: ApplicantValues) => {
      if (!user) {
        toast.error("Please login to apply for jobs");
        return;
      }

      if (!job_db) {
        window.location.href = feature_jobs?.url ?? "";
        return;
      }

      try {
        setIsApplying(true);

        if (!user?.resume || user.resume.length === 0) {
          toast.error("Please create a resume first");
          router.push("/new_resume");
        }

        if (!data.userId || !data.jobId || !data.resume) {
          toast.error("Missing required application data");
          return;
        }

        // Optimistic update
        setLocalIsApplied(true);

        const response = await insertApplicant({
          userId: data.userId,
          jobId: data.jobId,
          resume: data.resume,
          status: "pending",
        });

        if (response) {
          toast.success("Successfully applied for this job");
          // Invalidate and refetch applicants data
          await queryClient.invalidateQueries({ queryKey: ["applicants"] });
        } else {
          // Revert optimistic update if the request failed
          setLocalIsApplied(false);
          toast.error("Failed to apply for the job");
        }
      } catch (error) {
        console.error("Failed to apply:", error);
        // Revert optimistic update on error
        setLocalIsApplied(false);
      } finally {
        setIsApplying(false);
      }
    },
    [queryClient, feature_jobs?.url, job_db, user, router]
  );

  return (
    <Card className="bg-white hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
              <Image
                src={logoUrl || job_db?.company?.logo || "/placeholder.svg"}
                alt={`${job_db?.company_name || companyName} logo`}
                width={100}
                height={100}
                quality={100}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {feature_jobs?.title || job_db?.job_title}
              </h3>
              <p className="text-sm text-start text-gray-600">
                {job_db?.company_name || companyName}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`${
              isBookmarked ? "text-primary" : "text-gray-400"
            } hover:text-primary`}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs text-green-600">
            {job_db?.job_type || "Full Time"}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-900">
              ${job_db?.salary || "250"}
            </span>
            <span className="text-sm text-gray-500">/month</span>
          </div>
          <span className="text-sm text-gray-500">
            {formatDate(
              job_db?.createdAt.toString() || feature_jobs?.date_published
            )}
          </span>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <MapPin size={14} />
          <span className="text-sm">{job_db?.location || "N/A"}</span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Button
            variant="outline"
            className="flex-1 text-gray-600 hover:text-gray-900"
            asChild
          >
            <Link
              href={job_db ? `/job/${job_db?.id}` : feature_jobs?.url ?? ""}
            >
              View Detail
            </Link>
          </Button>
          <Button
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={() =>
              quickApply({
                userId: user?.id ?? "",
                jobId: job_db?.id ?? "",
                resume: user?.resume ?? "",
                status: "pending",
              })
            }
            disabled={isApplying || localIsApplied}
          >
            {isApplying ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Applying...
              </>
            ) : localIsApplied ? (
              "Applied"
            ) : (
              "Quick Apply"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
