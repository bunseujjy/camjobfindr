"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { JobFilters } from "./JobFilters";
import { JobListings } from "./JobListings";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { JobPostingResponse } from "@/features/job/types/jobsType";
import type { UserData } from "@/features/users/types/type";

interface JobSearchProps {
  jobs: JobPostingResponse[];
  user: UserData | null;
}

interface FilterState {
  jobType: string[]; // This corresponds to industry in the database
  experienceLevel: string[];
  salaryRange: string;
  location: string[];
}

export type SortOption = "relevance" | "newest" | "salary" | "expiring";

export function JobSearch({ jobs, user }: JobSearchProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize state from URL parameters
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "relevance"
  );

  const [activeFilters, setActiveFilters] = useState<FilterState>({
    jobType: searchParams.get("jobType")
      ? searchParams.get("jobType")!.split(",")
      : [],
    experienceLevel: searchParams.get("exp")
      ? searchParams.get("exp")!.split(",")
      : [],
    salaryRange: searchParams.get("salary") || "",
    location: searchParams.get("location")
      ? searchParams.get("location")!.split(",")
      : [],
  });

  const [filteredJobs, setFilteredJobs] = useState<JobPostingResponse[]>(jobs);
  const [sortedJobs, setSortedJobs] = useState<JobPostingResponse[]>(jobs);

  // Update URL with current filters, search query, and sort option
  const updateURL = (query: string, filters: FilterState, sort: SortOption) => {
    const params = new URLSearchParams();

    if (query) params.set("q", query);
    if (filters.jobType.length > 0)
      params.set("jobType", filters.jobType.join(","));
    if (filters.experienceLevel.length > 0)
      params.set("exp", filters.experienceLevel.join(","));
    if (filters.salaryRange) params.set("salary", filters.salaryRange);
    if (filters.location.length > 0)
      params.set("location", filters.location.join(","));
    if (sort) params.set("sort", sort);

    // Replace the current URL with the new parameters
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Centralized filtering function that applies all filters
  const applyAllFilters = useCallback(
    (query: string, filters: FilterState) => {
      // Start with all jobs
      let filtered = jobs;

      // Apply search query filter
      if (query) {
        filtered = filtered.filter(
          (job) =>
            job.job_posting?.job_title
              .toLowerCase()
              .includes(query.toLowerCase()) ||
            job.company?.name.toLowerCase().includes(query.toLowerCase()) ||
            job.job_posting?.location
              .toLowerCase()
              .includes(query.toLowerCase())
        );
      }

      // Job type filter (which corresponds to industry in the database)
      if (filters.jobType.length > 0) {
        filtered = filtered.filter((job) => {
          // Check if any of the selected job types (industries) match the job's industry
          return filters.jobType.some(
            (type) =>
              job.job_posting?.industry?.toLowerCase() === type.toLowerCase()
          );
        });
      }

      // Experience level filter
      if (filters.experienceLevel.length > 0) {
        filtered = filtered.filter((job) => {
          const years = Number.parseInt(
            job.job_posting?.experiences.split("-")[0]
          );
          if (filters.experienceLevel.includes("0-2 years") && years < 3)
            return true;
          if (
            filters.experienceLevel.includes("3-5 years") &&
            years >= 3 &&
            years <= 5
          )
            return true;
          if (filters.experienceLevel.includes("5+ years") && years > 5)
            return true;
          return false;
        });
      }

      // Location filter - handling locations that may contain commas
      if (filters.location.length > 0) {
        filtered = filtered.filter((job) => {
          const jobLocation = job.job_posting?.location.toLowerCase() || "";

          // Check if any of the selected locations are found in the job location
          return filters.location.some((loc) => {
            const locationToCheck = loc.toLowerCase();

            if (locationToCheck === "remote") {
              return jobLocation.includes("remote");
            } else if (locationToCheck === "on-site") {
              return !jobLocation.includes("remote");
            } else {
              // For specific locations, check if the job location contains this location
              return jobLocation.includes(locationToCheck);
            }
          });
        });
      }

      // Salary range filter
      if (filters.salaryRange) {
        filtered = filtered.filter((job) => {
          // Parse salary range from string like "$120,000 - $150,000"
          const salaryString = job.job_posting.salary;
          const salaryNumbers = salaryString?.match(/\d+,\d+|\d+/g);

          if (!salaryNumbers || salaryNumbers.length < 1) return false;

          // Get the lower bound of the job's salary range
          const jobSalaryLower = Number.parseInt(
            salaryNumbers[0].replace(/,/g, "")
          );

          // Parse the selected salary range
          const [minSalary, maxSalary] = filters.salaryRange
            .split("-")
            .map((s) => Number.parseInt(s));

          if (filters.salaryRange.endsWith("+")) {
            // Handle ranges like "150000+"
            const threshold = Number.parseInt(
              filters.salaryRange.replace("+", "")
            );
            return jobSalaryLower >= threshold;
          } else if (maxSalary) {
            // Handle ranges like "50000-100000"
            return jobSalaryLower >= minSalary && jobSalaryLower <= maxSalary;
          } else {
            // Handle ranges like "0-50000"
            return jobSalaryLower <= minSalary;
          }
        });
      }

      return filtered;
    },
    [jobs]
  );

  // Sort jobs based on the selected sort option
  const sortJobs = useCallback(
    (jobs: JobPostingResponse[], sortOption: SortOption) => {
      let sorted = [...jobs];

      switch (sortOption) {
        case "newest":
          // Sort by creation date (newest first)
          sorted = sorted.sort((a, b) => {
            const dateA = new Date(a.job_posting?.createdAt || 0).getTime();
            const dateB = new Date(b.job_posting?.createdAt || 0).getTime();
            return dateB - dateA;
          });
          break;
        case "expiring":
          // Sort by expiration date (soonest first)
          sorted = sorted.sort((a, b) => {
            const dateA = new Date(a.job_posting?.expiresAt || 0).getTime();
            const dateB = new Date(b.job_posting?.expiresAt || 0).getTime();

            // If no expiration date, put at the end
            if (!a.job_posting?.expiresAt) return 1;
            if (!b.job_posting?.expiresAt) return -1;

            return dateA - dateB;
          });
          break;
        case "salary":
          // Sort by salary (highest first)
          sorted = sorted.sort((a, b) => {
            // Extract salary numbers
            const salaryA = a.job_posting?.salary || "";
            const salaryB = b.job_posting?.salary || "";

            // Parse salary strings to get the lower bound
            const numbersA = salaryA.match(/\d+,\d+|\d+/g);
            const numbersB = salaryB.match(/\d+,\d+|\d+/g);

            // If no salary info, put at the end
            if (!numbersA) return 1;
            if (!numbersB) return -1;

            // Compare the lower bounds
            const lowerA = Number.parseInt(numbersA[0].replace(/,/g, ""));
            const lowerB = Number.parseInt(numbersB[0].replace(/,/g, ""));

            return lowerB - lowerA;
          });
          break;
        case "relevance":
        default:
          // For relevance, prioritize:
          // 1. Exact matches in title
          // 2. Partial matches in title
          // 3. Matches in company name or location
          // 4. Matches in skills required or industry
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            sorted = sorted.sort((a, b) => {
              const titleA = a.job_posting?.job_title.toLowerCase() || "";
              const titleB = b.job_posting?.job_title.toLowerCase() || "";
              const companyA = a.job_posting?.company_name.toLowerCase() || "";
              const companyB = b.job_posting?.company_name.toLowerCase() || "";
              const locationA = a.job_posting?.location.toLowerCase() || "";
              const locationB = b.job_posting?.location.toLowerCase() || "";
              const industryA = a.job_posting?.industry?.toLowerCase() || "";
              const industryB = b.job_posting?.industry?.toLowerCase() || "";

              // Check for skills matches (if available)
              const skillsA = a.job_posting?.skillsRequired || [];
              const skillsB = b.job_posting?.skillsRequired || [];
              const skillsAMatch = skillsA.some((skill) =>
                skill.toLowerCase().includes(query)
              );
              const skillsBMatch = skillsB.some((skill) =>
                skill.toLowerCase().includes(query)
              );

              // Exact title match
              if (titleA === query && titleB !== query) return -1;
              if (titleB === query && titleA !== query) return 1;

              // Title contains query
              const titleAContains = titleA.includes(query);
              const titleBContains = titleB.includes(query);
              if (titleAContains && !titleBContains) return -1;
              if (titleBContains && !titleAContains) return 1;

              // Skills match
              if (skillsAMatch && !skillsBMatch) return -1;
              if (skillsBMatch && !skillsAMatch) return 1;

              // Industry match
              if (industryA.includes(query) && !industryB.includes(query))
                return -1;
              if (industryB.includes(query) && !industryA.includes(query))
                return 1;

              // Company or location contains query
              const otherAContains =
                companyA.includes(query) || locationA.includes(query);
              const otherBContains =
                companyB.includes(query) || locationB.includes(query);

              if (otherAContains && !otherBContains) return -1;
              if (otherBContains && !otherAContains) return 1;

              return 0;
            });
          }
          break;
      }

      return sorted;
    },
    [searchQuery]
  );

  // Apply filters and sorting when dependencies change
  useEffect(() => {
    const filtered = applyAllFilters(searchQuery, activeFilters);
    setFilteredJobs(filtered);

    const sorted = sortJobs(filtered, sortBy);
    setSortedJobs(sorted);
  }, [
    searchParams,
    jobs,
    sortBy,
    activeFilters,
    applyAllFilters,
    searchQuery,
    sortJobs,
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Apply both search query and existing filters
    const filtered = applyAllFilters(searchQuery, activeFilters);
    setFilteredJobs(filtered);

    // Apply sorting
    const sorted = sortJobs(filtered, sortBy);
    setSortedJobs(sorted);

    // Update URL
    updateURL(searchQuery, activeFilters, sortBy);
  };

  const applyFilters = (filters: FilterState) => {
    setActiveFilters(filters);
    // Apply both filters and existing search query
    const filtered = applyAllFilters(searchQuery, filters);
    setFilteredJobs(filtered);

    // Apply sorting
    const sorted = sortJobs(filtered, sortBy);
    setSortedJobs(sorted);

    // Update URL
    updateURL(searchQuery, filters, sortBy);
  };

  // Handle sort change
  const handleSortChange = (option: SortOption) => {
    setSortBy(option);

    // Apply sorting to current filtered jobs
    const sorted = sortJobs(filteredJobs, option);
    setSortedJobs(sorted);

    // Update URL
    updateURL(searchQuery, activeFilters, option);
  };

  // Update filtered jobs when search query changes (for real-time filtering)
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    // Apply both the new query and existing filters
    const filtered = applyAllFilters(newQuery, activeFilters);
    setFilteredJobs(filtered);

    // Apply sorting
    const sorted = sortJobs(filtered, sortBy);
    setSortedJobs(sorted);

    // Debounce URL updates to avoid too many history entries
    // Only update URL after user stops typing for 500ms
    const timeoutId = setTimeout(() => {
      updateURL(newQuery, activeFilters, sortBy);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Desktop filters - hidden on mobile */}
      <div className="hidden md:block md:col-span-1">
        <JobFilters
          onApplyFilters={applyFilters}
          initialFilters={activeFilters}
        />
      </div>

      {/* Mobile filters - shown only on mobile */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="mb-4 w-full flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <JobFilters
              onApplyFilters={applyFilters}
              initialFilters={activeFilters}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="col-span-1 md:col-span-3">
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search jobs, companies, or locations..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="pl-10"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        <JobListings
          jobs={sortedJobs}
          onSortChange={handleSortChange}
          currentSort={sortBy}
          applicant={[]}
          saved_jobs={[]}
          user={user}
        />
      </div>
    </div>
  );
}
