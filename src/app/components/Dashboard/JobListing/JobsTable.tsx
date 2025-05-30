"use client";

import { useCallback, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MoreHorizontal,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Users,
  PauseCircle,
  PlayCircle,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";
import { JobPostingResponse } from "@/features/job/types/jobsType";
import { ApplicantType } from "@/features/applicant/types/job_type";
import Link from "next/link";
import { removeJob, updatingJobStatus } from "@/features/job/db/job";
import { toast } from "sonner";

interface JobsTableProps {
  jobs: JobPostingResponse[];
  applicants: ApplicantType[];
}

export function JobsTable({ jobs, applicants }: JobsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("postedDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [localJob, setLocalJob] = useState<JobPostingResponse[]>(jobs);

  // Get unique departments for filter
  const departments = Array.from(
    new Set(jobs.map((job) => job.job_posting?.industry))
  );

  // Filter jobs based on search query and filters
  const filteredJobs = localJob.filter((job) => {
    // Search filter
    const matchesSearch =
      job.job_posting?.job_title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      job.job_posting?.industry
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      job.job_posting?.location
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === "all" || job.job_posting?.available === statusFilter;

    // Department filter
    const matchesDepartment =
      departmentFilter.length === 0 ||
      departmentFilter.includes(job.job_posting?.industry ?? "");

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Sort filtered jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "title") {
      return sortOrder === "asc"
        ? a.job_posting?.job_title.localeCompare(b.job_posting?.job_title)
        : b.job_posting?.job_title.localeCompare(a.job_posting?.job_title);
    } else if (sortBy === "applicants") {
      const countA = applicants.filter(
        (app) => app.jobId === a.job_posting?.id
      ).length;
      const countB = applicants.filter(
        (app) => app.jobId === b.job_posting?.id
      ).length;
      return sortOrder === "asc" ? countA - countB : countB - countA;
    } else if (sortBy === "postedDate") {
      const dateA = a.job_posting?.createdAt
        ? new Date(a.job_posting.createdAt).getTime()
        : 0;
      const dateB = b.job_posting?.createdAt
        ? new Date(b.job_posting.createdAt).getTime()
        : 0;
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const toggleDepartmentFilter = (department: string) => {
    setDepartmentFilter((prev) =>
      prev.includes(department)
        ? prev.filter((d) => d !== department)
        : [...prev, department]
    );
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const onUpdateStatus = useCallback(
    async (jobId: string, status: "open" | "closed", postedById: string) => {
      try {
        // 2. Make the actual API call
        const response = await updatingJobStatus(jobId, status, postedById);

        if (!response) {
          throw new Error("Failed to update status");
        }
        // 1. Optimistically update the UI immediately
        setLocalJob((prevJobs) =>
          prevJobs.map((job) =>
            job.job_posting.id === jobId
              ? {
                  ...job,
                  job_posting: {
                    ...job.job_posting,
                    available: status,
                  },
                }
              : job
          )
        );
        toast.success(`Status updated to ${status}`);
      } catch (error) {
        // 4. Revert if the API call fails
        setLocalJob((prevJobs) =>
          prevJobs.map((job) =>
            job.job_posting.id === jobId
              ? {
                  ...job,
                  job_posting: {
                    ...job.job_posting,
                    available:
                      job.job_posting.available === "open" ? "closed" : "open",
                  },
                }
              : job
          )
        );

        toast.error("Failed to update status");
        console.error(error);
      }
    },
    [] // Empty dependency array since we're not using any external values
  );

  const onDeleteJob = async (jobId: string, postedById: string) => {
    try {
      const response = await removeJob(jobId, postedById);

      if (response) {
        toast.success("Successfully deleting this job");
        setLocalJob((currentJob) =>
          currentJob.filter((job) => job.job_posting.id !== jobId)
        );
      } else {
        toast.error("Failed to deleting this job");
      }
    } catch (error) {
      console.error(error, "Bad Request");
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle>All Job Listings</CardTitle>
            <CardDescription>
              You have {jobs.length} job listings (
              {
                filteredJobs.filter(
                  (job) => job.job_posting?.available === "open"
                ).length
              }{" "}
              active)
            </CardDescription>
          </div>
        </div>

        <div className="mt-6">
          <Tabs defaultValue="all" onValueChange={setStatusFilter}>
            <div className="overflow-x-auto scrollbar-thin pb-2">
              <TabsList className="inline-flex w-auto min-w-full h-10">
                <TabsTrigger value="all" className="flex-1 px-3 py-1.5 text-sm">
                  All Jobs
                </TabsTrigger>
                <TabsTrigger
                  value="open"
                  className="flex-1 px-3 py-1.5 text-sm"
                >
                  Active
                </TabsTrigger>

                <TabsTrigger
                  value="closed"
                  className="flex-1 px-3 py-1.5 text-sm"
                >
                  Closed
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </div>

        <div className="flex flex-col gap-4 pt-4 sm:flex-row">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-1 w-full sm:w-auto">
                <Filter className="h-3.5 w-3.5" />
                <span>Department</span>
                {departmentFilter.length > 0 && (
                  <Badge variant="secondary" className="ml-1 rounded-full px-1">
                    {departmentFilter.length}
                  </Badge>
                )}
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Department</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {departments.map((department) => (
                <DropdownMenuCheckboxItem
                  key={department}
                  checked={departmentFilter.includes(department ?? "")}
                  onCheckedChange={() =>
                    toggleDepartmentFilter(department ?? "")
                  }
                >
                  {department &&
                    department?.charAt(0).toUpperCase() + department?.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
              {departmentFilter.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setDepartmentFilter([])}
                    className="justify-center text-center"
                  >
                    Clear Filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-1 p-0 font-medium"
                    onClick={() => handleSort("title")}
                  >
                    Job Title
                    {sortBy === "title" && (
                      <ArrowUpDown
                        className={`h-3.5 w-3.5 ${
                          sortOrder === "asc" ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="min-w-[120px]">Location</TableHead>
                <TableHead className="min-w-[120px]">Department</TableHead>
                <TableHead className="min-w-[100px]">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-1 p-0 font-medium"
                    onClick={() => handleSort("applicants")}
                  >
                    Applicants
                    {sortBy === "applicants" && (
                      <ArrowUpDown
                        className={`h-3.5 w-3.5 ${
                          sortOrder === "asc" ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </Button>
                </TableHead>

                <TableHead className="min-w-[100px]">Status</TableHead>
                <TableHead className="min-w-[120px]">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-1 p-0 font-medium"
                    onClick={() => handleSort("postedDate")}
                  >
                    Posted
                    {sortBy === "postedDate" && (
                      <ArrowUpDown
                        className={`h-3.5 w-3.5 ${
                          sortOrder === "asc" ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="text-right min-w-[80px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedJobs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No jobs found. Try adjusting your search or filters.
                  </TableCell>
                </TableRow>
              ) : (
                sortedJobs.map((job) => {
                  const applicants_length = applicants.filter(
                    (app) => app.jobId === job.job_posting.id
                  ).length;
                  return (
                    <TableRow key={job.job_posting?.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {job.job_posting?.job_title.charAt(0).toUpperCase() +
                            job.job_posting?.job_title.slice(1)}
                          {/* {job.job_posting?.featured && (
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        )} */}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {job.job_posting?.salary}
                        </div>
                      </TableCell>
                      <TableCell>{job.job_posting?.location}</TableCell>
                      <TableCell>
                        {job.job_posting?.industry &&
                          job.job_posting?.industry?.charAt(0).toUpperCase() +
                            job.job_posting?.industry?.slice(1)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          {applicants_length}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            job.job_posting?.available === "open"
                              ? "default"
                              : job.job_posting?.available === "closed"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {job.job_posting?.available === "open"
                            ? "Active"
                            : "Closed"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(job.job_posting?.createdAt.toString())}
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
                              <Link
                                href={`/job/${job.job_posting?.id}`}
                                className="flex items-center"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link
                                href={`/job/${job.job_posting?.id}/edit`}
                                className="flex items-center"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Job
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link
                                href="/dashboard/applicants"
                                className="flex items-center"
                              >
                                <Users className="mr-2 h-4 w-4" />
                                View Applicants
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            {job.job_posting?.available === "open" ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  onUpdateStatus(
                                    job.job_posting.id,
                                    "closed",
                                    job.job_posting.postedById
                                  )
                                }
                              >
                                <PauseCircle className="mr-2 h-4 w-4" />
                                Pause Listing
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() =>
                                  onUpdateStatus(
                                    job.job_posting.id,
                                    "open",
                                    job.job_posting.postedById
                                  )
                                }
                              >
                                <PlayCircle className="mr-2 h-4 w-4" />
                                Publish Listing
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() =>
                                onDeleteJob(
                                  job.job_posting.id,
                                  job.job_posting.postedById
                                )
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Job
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
