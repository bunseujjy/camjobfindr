import { getAllJob } from "@/features/job/actions/job";
import { getCurrentUser } from "@/services/clerk";
import React from "react";
import { JobSearch } from "./JobSearch";
import { JobPostingResponse } from "@/features/job/types/jobsType";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const url = `${process.env.BASE_URL}/search`;
  return {
    title: "Search Jobs",
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
      title: "Find What You Want Here",
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

const SearchPage = async () => {
  const { user } = await getCurrentUser({ allData: true });
  const jobs = await getAllJob();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Find Your Dream Job</h1>
      <JobSearch jobs={jobs as unknown as JobPostingResponse[]} user={user} />
    </div>
  );
};
export default SearchPage;
