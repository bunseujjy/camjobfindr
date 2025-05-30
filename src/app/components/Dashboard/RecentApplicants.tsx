"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Mail,
  Calendar,
  FileText,
  UserX,
  Clock,
  X,
} from "lucide-react";
import type { ApplicantType } from "@/features/applicant/types/job_type";
import type { UserData } from "@/features/users/types/type";
import { updateApplicationStatus } from "@/features/applicant/db/applicant";
import { toast } from "sonner";
import ResumePreview from "@/features/resume/db/component/ResumePreview";
import { mapToResumeValues } from "@/lib/utils";
import { ResumeData } from "@/features/resume/schema/resumeSchema";
import Link from "next/link";

interface RecentApplicantsProps {
  applicants: ApplicantType[];
  all_user: UserData[] | null;
  resumeData: ResumeData[];
  className?: string;
}

export function RecentApplicants({
  applicants: initialApplicants,
  all_user,
  resumeData,
  className,
}: RecentApplicantsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("all");
  // Create a state with the initial applicants
  const [applicants, setApplicants] =
    useState<ApplicantType[]>(initialApplicants);
  const [openResume, setOpenResume] = useState<boolean>(false);
  const applicant_details = all_user?.find((user) =>
    applicants?.some((app) => app.userId === user.id)
  );

  const filteredApplicants =
    selectedTab === "all"
      ? applicants
      : applicants.filter((applicant) => applicant.status === selectedTab);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>;
      case "reviewed":
        return <Badge variant="outline">Reviewed</Badge>;
      case "interviewing":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">
            Interviewing
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHrs < 24) {
      return `${diffHrs} hours ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  // Use useCallback to memoize the function
  const scheduleInterview = useCallback(
    async (
      applicantId: string,
      status: "pending" | "rejected" | "interviewing"
    ) => {
      try {
        // Call the API to update the status
        const result = await updateApplicationStatus(applicantId, status);

        if (result) {
          toast.success(`Successfully update applicant status as ${status}`); // Update the local state immediately for a responsive UI
          setApplicants((currentApplicants) =>
            currentApplicants.map((applicant) =>
              applicant.id === applicantId
                ? { ...applicant, status }
                : applicant
            )
          );
        } else {
          // If the API call fails, revert the change
          setApplicants((currentApplicants) =>
            currentApplicants.map((applicant) =>
              applicant.id === applicantId
                ? {
                    ...applicant,
                    status:
                      initialApplicants.find((a) => a.id === applicantId)
                        ?.status || "pending",
                  }
                : applicant
            )
          );
          throw new Error("Failed to update applicant status");
        }
      } catch (error) {
        console.error(error, "Bad Request");
        toast.error("Failed to update status. Please try again.");
      }
    },
    [initialApplicants]
  );

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Applicants</CardTitle>
            <CardDescription>
              Review your latest job applicants.
            </CardDescription>
          </div>

          <Button variant="outline" size="sm">
            <Link href="/dashboard/applicants">View All</Link>
          </Button>
        </div>
        <div className="flex items-center gap-2 pt-4">
          <Button
            variant={selectedTab === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTab("all")}
          >
            All
          </Button>
          <Button
            variant={selectedTab === "new" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTab("new")}
          >
            New
          </Button>
          <Button
            variant={selectedTab === "interviewing" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTab("interviewing")}
          >
            Interviewing
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredApplicants.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-center text-muted-foreground">
              No applicants found in this category.
            </div>
          ) : (
            filteredApplicants.map((applicant) => {
              const applicants_resume = resumeData.filter(
                (resume) => resume.userId !== applicant.userId
              );
              return (
                <div
                  key={applicant.id}
                  className="flex items-center justify-between rounded-lg border p-3 relative"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage
                        src={applicant_details?.imageUrl ?? ""}
                        alt={applicant_details?.username || "Applicant Avatar"}
                      />
                      <AvatarFallback>
                        {getInitials(applicant_details?.username ?? "")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {applicant_details?.username}
                      </div>

                      <div className="mt-1 flex items-center gap-2">
                        {getStatusBadge(applicant.status as string)}
                        <span className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDate(
                            applicant.appliedAt?.toString() as string
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="h-4 w-4" />
                      <span className="sr-only">Email</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Calendar className="h-4 w-4" />
                      <span className="sr-only">Schedule</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => setOpenResume(!openResume)}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          View Resume
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Contact Applicant
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            scheduleInterview(applicant.id, "interviewing")
                          }
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule Interview
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() =>
                            scheduleInterview(applicant.id, "rejected")
                          }
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Reject Application
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>{" "}
                  </div>
                  {openResume && (
                    <div className="fixed inset-0 bg-black/50 z-[998] flex items-center justify-center p-4">
                      <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div className="absolute top-4 right-4">
                          <button
                            onClick={() => setOpenResume(!openResume)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="w-6 h-6" />
                          </button>
                        </div>
                        <ResumePreview
                          formData={mapToResumeValues(
                            applicants_resume as ResumeData
                          )}
                          className="h-[calc(90vh-3rem)] overflow-auto p-6"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
