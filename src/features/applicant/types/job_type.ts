import { JobPostingResponse } from "@/features/job/types/jobsType";
import { ResumeValues } from "@/features/resume/type/resumeType";
import { UserData } from "@/features/users/types/type";

export type ApplicantType = {
    userId: string;
    jobId: string;
    coverLetter: string | null;
    status?: "pending" | "interviewing" | "rejected";
    id: string;
    createdAt: Date;
    appliedAt: Date | null;
    resume: ResumeValues;
    user: UserData | null;
    job: JobPostingResponse
}