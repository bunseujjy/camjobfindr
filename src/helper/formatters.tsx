import { JobPostingResponse } from "@/features/job/types/jobsType";

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

export const formatSalary = (
  salary: number | string | null | undefined
): string => {
  // Handle null/undefined cases
  if (salary === null || salary === undefined) {
    return "Not specified";
  }

  // Convert string to number if needed
  const numericSalary =
    typeof salary === "string" ? parseFloat(salary) : salary;

  // Handle NaN cases (invalid number conversion)
  if (isNaN(numericSalary)) {
    return "Invalid salary";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numericSalary);
};

export const filterSimilarJobs = (
  job: JobPostingResponse | undefined,
  all_jobs: JobPostingResponse[]
) => {
  return all_jobs
    .filter(
      (jobs) => jobs?.job_posting?.job_type === job?.job_posting?.job_type
    )
    .filter((jobs) => job?.job_posting?.id !== jobs.job_posting?.id);
};
