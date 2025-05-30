"use cache";

import { getAllJob, getJob } from "@/features/job/actions/job";
import { getCurrentUser } from "@/services/clerk";
import JobComponent from "./JobComponent";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;
  const url = `${process.env.BASE_URL}/job/${id}`;
  const jobs = await getJob();
  const job = jobs.find((j) => j.job_posting.id === id);
  return {
    title: `${job?.job_posting.job_title}`,
    description: `${job?.job_posting.description}`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
      title: `${job?.job_posting.job_title}`,
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

const JobPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const id = params.id;
  const { userId, user } = await getCurrentUser({ allData: true });
  const jobs = await getJob();
  const job = jobs.find((j) => j.job_posting.id === id);
  const all_jobs = await getAllJob();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobComponent job={job} all_jobs={all_jobs} userId={userId} user={user} />
    </Suspense>
  );
};

export default JobPage;
