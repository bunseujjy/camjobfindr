"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SavedJobsFilter } from "./SavedJobsFilter";
import { SavedJobsCard } from "./SavedJobsCard";
import type { JobPostingResponse } from "@/features/job/types/jobsType";
import { type ChangeEvent, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ApplicantType } from "@/features/applicant/types/job_type";

interface SavedJobsContentProps {
  filteredJobs: JobPostingResponse[];
  applicant: boolean;
  getApplicant: ApplicantType[];
}

type FilterOption = {
  id: string;
  label: string;
};

export const dateOptions: FilterOption[] = [
  { id: "newest", label: "Newest first" },
  { id: "oldest", label: "Oldest first" },
];

export const statusOptions: FilterOption[] = [
  { id: "all", label: "All jobs" },
  { id: "new", label: "New jobs" },
  { id: "applied", label: "Applied jobs" },
];

export function SavedJobsContent({
  filteredJobs,
  applicant,
  getApplicant,
}: SavedJobsContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get URL parameters
  const queryParam = searchParams.get("query") || "";
  const dateParam = searchParams.get("date") || "newest";
  const statusParam = searchParams.get("status") || "all";

  // Initialize state from URL parameters
  const [search, setSearch] = useState(queryParam);
  const [dateFilter, setDateFilter] = useState(dateParam);
  const [statusFilter, setStatusFilter] = useState(statusParam);

  // Update search state when URL query parameter changes
  useEffect(() => {
    setSearch(queryParam);
  }, [queryParam]);

  // Update filter states when URL parameters change
  useEffect(() => {
    setDateFilter(dateParam);
    setStatusFilter(statusParam);
  }, [dateParam, statusParam]);

  // Handle search input
  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  // Update URL when filters change
  const updateFilters = (newDateFilter: string, newStatusFilter: string) => {
    setDateFilter(newDateFilter);
    setStatusFilter(newStatusFilter);

    const params = new URLSearchParams(searchParams.toString());

    if (newDateFilter !== "newest") {
      params.set("date", newDateFilter);
    } else {
      params.delete("date");
    }

    if (newStatusFilter !== "all") {
      params.set("status", newStatusFilter);
    } else {
      params.delete("status");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  // Filter jobs by search term
  const filteredSearchJob = filteredJobs.filter((job) =>
    job.job_posting.job_title.toLowerCase().includes(queryParam.toLowerCase())
  );

  // Apply status filtering
  const statusFilteredJobs = filteredSearchJob.filter((job) => {
    if (statusFilter === "all") {
      return true;
    } else if (statusFilter === "new") {
      // Check if job is new (not applied to)
      return !getApplicant.some(
        (app) => app.userId === job.job_posting.postedById
      );
    } else if (statusFilter === "applied") {
      // Check if job is applied to
      return getApplicant.some(
        (app) => app.userId === job.job_posting.postedById
      );
    }
    return true;
  });

  // Apply date sorting
  const sortedJobs = [...statusFilteredJobs].sort((a, b) => {
    const dateA = new Date(a.job_posting?.createdAt).getTime();
    const dateB = new Date(b.job_posting?.createdAt).getTime();

    if (dateFilter === "newest") {
      return dateB - dateA; // Newest first (descending)
    } else {
      return dateA - dateB; // Oldest first (ascending)
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search saved jobs..."
            className="w-full pl-9"
            value={search}
            onChange={onInput}
          />
        </div>
        <SavedJobsFilter
          dateFilter={dateFilter}
          statusFilter={statusFilter}
          setDateFilter={(newDateFilter) =>
            updateFilters(newDateFilter, statusFilter)
          }
          setStatusFilter={(newStatusFilter) =>
            updateFilters(dateFilter, newStatusFilter)
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedJobs.map((job) => (
          <SavedJobsCard
            key={job.job_posting.id}
            job={job}
            applicant={applicant}
          />
        ))}
      </div>

      {sortedJobs.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="text-muted-foreground mb-2 text-sm">
            {queryParam
              ? `No jobs found matching "${queryParam}"`
              : "No saved jobs found"}
          </div>
          <div className="text-xs text-muted-foreground mb-4">
            {(statusFilter !== "all" || dateFilter !== "newest") &&
              "Try adjusting your filters or search terms"}
          </div>
          <Button variant="outline" size="sm">
            Browse Jobs
          </Button>
        </div>
      )}
    </div>
  );
}
