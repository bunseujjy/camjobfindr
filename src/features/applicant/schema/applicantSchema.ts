import { z } from "zod";

export const applicantSchema = z.object({
    userId: z.string().min(1, "UserID is requried"),
    jobId: z.string().min(1, "JobID is requried"),
    resume: z.string().min(1, "Resume is required"),
    coverLetter: z.string().optional(),
    status: z.enum(['pending', 'interviewing', 'rejected']),
})


export type ApplicantValues = z.infer<typeof applicantSchema>