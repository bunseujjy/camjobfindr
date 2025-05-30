import React from "react";
import { db } from "@/drizzle/db";
import { CompanyTable, JobPostingTable, UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { getCurrentUser } from "@/services/clerk";
import UserJobsPage from "./Job";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const url = `${process.env.BASE_URL}/job_listing`;
  return {
    title: "Jobs Listing",
    description: "All of the jobs in this website is listing here.",
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
      title: "Jobs Listing",
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

const JobListingPage = async () => {
  const { userId, user } = await getCurrentUser({ allData: true });

  if (!userId) {
    notFound();
  }

  try {
    const [job, all_jobs] = await Promise.all([getJob(), getAllJob(userId)]);

    return (
      <div>
        <UserJobsPage job={job} all_jobs={all_jobs} user={user} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching job data:", error);
    throw error;
  }
};

export default JobListingPage;

const getJob = unstable_cache(
  async () => {
    try {
      const job = await db
        .select()
        .from(JobPostingTable)
        .leftJoin(CompanyTable, eq(JobPostingTable.companyId, CompanyTable.id))
        .leftJoin(UserTable, eq(JobPostingTable.postedById, UserTable.id))
        .limit(1);

      return job[0];
    } catch (error) {
      console.error("Error fetching job:", error);
      throw error;
    }
  },
  [`user-job`],
  { revalidate: 60, tags: [`user-job`] }
);

const getAllJob = unstable_cache(
  async (userId: string) => {
    try {
      const jobs = await db
        .select()
        .from(JobPostingTable)
        .leftJoin(CompanyTable, eq(JobPostingTable.companyId, CompanyTable.id))
        .where(eq(JobPostingTable.postedById, userId));

      return jobs;
    } catch (error) {
      console.error("Error fetching all jobs:", error);
      throw error;
    }
  },
  [`user-jobs-list`],
  { revalidate: 60, tags: [`user-jobs-list`] }
);
