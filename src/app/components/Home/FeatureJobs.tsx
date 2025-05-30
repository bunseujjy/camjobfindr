"use client";

import React from "react";
import { useJobsData, useJobsDataFromDB } from "@/utils/hooks/useJobsData";
import { Job } from "./types";
import JobCard from "./JobCard";
import { UserData } from "@/features/users/types/type";
import { ApplicantType } from "@/features/applicant/types/job_type";

interface FeatureJobsType {
  user: UserData | null;
  applicant: ApplicantType[];
}
const FeatureJobs = ({ user, applicant }: FeatureJobsType) => {
  const { data: feature_jobs } = useJobsData();
  const { data: job_db } = useJobsDataFromDB();
  return (
    <div className="container mx-auto text-center py-10">
      <h1 className="text-lg md:text-xl lg:text-2xl xl:text-4xl font-bold">
        Featured Jobs
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10">
        {job_db?.slice(0, 9)?.map((job) => {
          const isApplied = applicant.some(
            (app) => app.userId === user?.id && app.jobId === job.id
          );
          return (
            <JobCard
              job_db={job}
              key={job.id}
              user={user}
              applicant={applicant}
              isApplied={isApplied}
            />
          );
        })}
        {feature_jobs?.items.slice(0, 9)?.map((job: Job) => {
          return (
            <JobCard
              feature_jobs={job}
              key={job.guid}
              user={user}
              applicant={applicant}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FeatureJobs;
