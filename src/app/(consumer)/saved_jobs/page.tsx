// Server component for Saved Jobs page
import { Suspense } from "react";
import { SavedJobsContent } from "./SavedJobsContent";
import { SavedJobsLoading } from "./SavedJobsLoading";
import { getCurrentUser } from "@/services/clerk";
import { getAllJob, getSavedJobs } from "@/features/job/actions/job";
import { fetchApplicant } from "@/features/applicant/db/applicant";
import { ApplicantType } from "@/features/applicant/types/job_type";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const url = `${process.env.BASE_URL}/saved_jobs`;
  return {
    title: "Saved Jobs",
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
      title: "All of your saved jobs is here.",
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

export default async function SavedJobsPage() {
  const { userId } = await getCurrentUser({ allData: false });
  const all_jobs = await getAllJob();
  const saved_jobs = await getSavedJobs(userId as string);
  const getApplicant = await fetchApplicant(userId as string);
  const applicant = getApplicant.some((app) => app.userId === userId);
  const filteredJobs = all_jobs.filter((j) =>
    saved_jobs?.find((save) => save.jobId.includes(j.job_posting.id))
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Saved Jobs</h1>
        <p className="text-muted-foreground mt-1">
          Manage and track your saved job opportunities
        </p>
      </div>

      <Suspense fallback={<SavedJobsLoading />}>
        <SavedJobsContent
          filteredJobs={filteredJobs}
          applicant={applicant as boolean}
          getApplicant={getApplicant as unknown as ApplicantType[]}
        />
      </Suspense>
    </div>
  );
}
