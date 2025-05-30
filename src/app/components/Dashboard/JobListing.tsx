"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  Search,
  Edit,
  Trash2,
  Eye,
  Users,
  PauseCircle,
  PlayCircle,
} from "lucide-react";
import { JobPostingResponse } from "@/features/job/types/jobsType";
import { ApplicantType } from "@/features/applicant/types/job_type";
import Link from "next/link";

interface JobListingsProps {
  jobs: JobPostingResponse[];
  applicants: ApplicantType[];
  className?: string;
}

export function JobListings({ jobs, className, applicants }: JobListingsProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredJobs = jobs.filter(
    (job) =>
      job.job_posting?.job_title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      job.job_posting?.industry
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      job.job_posting?.location
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const getApplicantsCount = (jobId: string) => {
    return applicants.filter((applicant) => applicant.jobId === jobId).length;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Job Listings</CardTitle>
            <CardDescription>
              Manage your active and draft job postings.
            </CardDescription>
          </div>
          <Link href="/dashboard/jobs">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-2 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search jobs..."
              className="w-full pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Applicants</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead>Closing</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center h-24 text-muted-foreground"
                >
                  No jobs found. Try adjusting your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job) => (
                <TableRow key={job.job_posting?.id}>
                  <TableCell className="font-medium">
                    {job.job_posting?.job_title}
                  </TableCell>
                  <TableCell>{job.job_posting?.location}</TableCell>
                  <TableCell>{job.job_posting?.industry}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      {getApplicantsCount(job.job_posting.id)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        job.job_posting?.available === "open"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {job.job_posting?.available === "open"
                        ? "Active"
                        : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDate(job.job_posting?.createdAt.toDateString())}
                  </TableCell>
                  <TableCell>
                    {formatDate(
                      job.job_posting?.expiresAt?.toString() as string | null
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Job
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" />
                          View Applicants
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {job.job_posting?.available === "open" ? (
                          <DropdownMenuItem>
                            <PauseCircle className="mr-2 h-4 w-4" />
                            Pause Listing
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>
                            <PlayCircle className="mr-2 h-4 w-4" />
                            Publish Listing
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Job
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
