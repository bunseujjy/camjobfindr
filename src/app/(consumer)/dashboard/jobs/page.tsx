import { DashboardHeader } from "@/app/components/Dashboard/DashboardHeader";
import { DashboardShell } from "@/app/components/Dashboard/DashboardShell";
import { JobsTableSkeleton } from "@/app/components/Dashboard/JobListing/JobsSkeleton";
import { JobsTable } from "@/app/components/Dashboard/JobListing/JobsTable";
import { fetchAllApplicant } from "@/features/applicant/db/applicant";
import { ApplicantType } from "@/features/applicant/types/job_type";
import { getAllJob } from "@/features/job/actions/job";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const url = `${process.env.BASE_URL}/dashboard/jobs`;
  return {
    title: "Jobs - Dashboard",
    description: "Admin Dashboard",
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
      title: "Jobs - Dashboard",
      siteName: "CamJobFindr",
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default function JobsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Job Listings"
        text="Create and manage your job postings."
      />

      <Suspense fallback={<JobsTableSkeleton />}>
        <JobsContent />
      </Suspense>
    </DashboardShell>
  );
}

async function JobsContent() {
  // In a real app, you would fetch this data from your API
  const jobs = await getAllJob();
  const applicants = await fetchAllApplicant();

  return (
    <JobsTable
      jobs={jobs}
      applicants={applicants as unknown as ApplicantType[]}
    />
  );
}
