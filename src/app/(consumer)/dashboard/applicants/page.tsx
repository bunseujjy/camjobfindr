import { ApplicantsView } from "@/app/components/Dashboard/Applicants/ApplicantsView";
import { ApplicantsViewSkeleton } from "@/app/components/Dashboard/Applicants/ApplicantsViewSkeleton";
import { DashboardHeader } from "@/app/components/Dashboard/DashboardHeader";
import { DashboardShell } from "@/app/components/Dashboard/DashboardShell";
import { fetchAllApplicant } from "@/features/applicant/db/applicant";
import { ApplicantType } from "@/features/applicant/types/job_type";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const url = `${process.env.BASE_URL}/dashboard`;
  return {
    title: "Applicants - Dashboard",
    description: "Admin Dashboard",
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
      title: "Applicants - Dashboard",
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

export default function ApplicantsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Applicants"
        text="Review and manage all job applicants."
      />

      <Suspense fallback={<ApplicantsViewSkeleton />}>
        <ApplicantsContent />
      </Suspense>
    </DashboardShell>
  );
}

async function ApplicantsContent() {
  // In a real app, you would fetch this data from your API
  const applicants = await fetchAllApplicant();

  return (
    <ApplicantsView applicants={applicants as unknown as ApplicantType[]} />
  );
}
