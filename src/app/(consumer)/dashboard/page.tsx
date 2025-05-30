import { DashboardHeader } from "@/app/components/Dashboard/DashboardHeader";
import { DashboardOverview } from "@/app/components/Dashboard/DashboardOverview";
import { DashboardShell } from "@/app/components/Dashboard/DashboardShell";
import { DashboardSkeleton } from "@/app/components/Dashboard/DashboardSkeleton";
import { JobListings } from "@/app/components/Dashboard/JobListing";
import { RecentApplicants } from "@/app/components/Dashboard/RecentApplicants";
import { db } from "@/drizzle/db";
import { fetchAllApplicant } from "@/features/applicant/db/applicant";
import { ApplicantType } from "@/features/applicant/types/job_type";
import { getAllJob } from "@/features/job/actions/job";
import { ResumeData } from "@/features/resume/schema/resumeSchema";
import { getAllUser } from "@/features/users/db/users";
import { UserData } from "@/features/users/types/type";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const url = `${process.env.BASE_URL}/dashboard`;
  return {
    title: "Dashboard",
    description: "Admin Dashboard",
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
      title: "Dashboard",
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

export default function EmployerDashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Job Dashboard"
        text="Manage your job postings and applicants in one place."
      />

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </DashboardShell>
  );
}

async function DashboardContent() {
  const dashboardData = await getAllJob();
  const applicants = await fetchAllApplicant();
  const all_user = await getAllUser();

  const resumeData = await db.query.ResumeTable.findMany();
  return (
    <div className="grid gap-6">
      <DashboardOverview
        data={dashboardData}
        applicants={applicants as unknown as ApplicantType[]}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <JobListings
          jobs={dashboardData}
          applicants={applicants as unknown as ApplicantType[]}
          className="md:col-span-1 lg:col-span-4"
        />
        <RecentApplicants
          applicants={applicants as unknown as ApplicantType[]}
          all_user={all_user as UserData[] | null}
          resumeData={resumeData as ResumeData[]}
          className="md:col-span-1 lg:col-span-3"
        />
      </div>
    </div>
  );
}
