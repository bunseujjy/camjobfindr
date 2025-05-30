import {
  JobPostingResponse,
  SavedJobType,
} from "@/features/job/types/jobsType";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { JobDescription } from "./JobDescription";
import { CompanyInfo } from "./CompanyInfo";
import { ContactInfo } from "./ContactInfo";
import { SimilarJobs } from "./SimilarJobs";
import { filterSimilarJobs } from "@/helper/formatters";
import { UserData } from "@/features/users/types/type";
import JobHeader from "./JobHeader";
import { fetchApplicant } from "@/features/applicant/db/applicant";
import { ApplicantType } from "@/features/applicant/types/job_type";
import { getSavedJobs } from "@/features/job/actions/job";

interface JobComponentProps {
  job: JobPostingResponse | undefined;
  all_jobs: JobPostingResponse[];
  userId: string | undefined;
  user: UserData | null;
}

const JobComponent = async ({
  job,
  all_jobs,
  userId,
  user,
}: JobComponentProps) => {
  const similarJobs = filterSimilarJobs(job, all_jobs);
  const applicant = await fetchApplicant(userId as string);
  const saved_jobs = await getSavedJobs(userId as string);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - job details */}
        <div className="lg:col-span-2 space-y-8">
          <JobHeader
            job={job}
            data={{
              jobId: job?.job_posting.id,
              userId: userId,
              resume: user?.resume,
              status: ["pending", "interviewing", "rejected"],
            }}
            applicant={applicant as unknown as ApplicantType[]}
            saved_jobs={saved_jobs as SavedJobType[]}
          />
          <Separator />
          <JobDescription job={job} />
        </div>

        {/* Sidebar - company info */}
        <div className="space-y-6">
          <CompanyInfo job={job} />
          <ContactInfo job={job} />
          <SimilarJobs job={job} similarJobs={similarJobs} />

          <div className="text-center">
            <Link href="/jobs" className="text-primary hover:underline">
              Back to all jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobComponent;
