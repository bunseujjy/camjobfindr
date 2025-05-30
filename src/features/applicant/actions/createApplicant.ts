'use server'

import { z } from "zod";
import { applicantSchema } from "../schema/applicantSchema";
import { insertApplicant } from "../db/applicant";
import { revalidateApplicantTag } from "../db/cache";

export const createApplicant = async (unsafeData: z.infer<typeof applicantSchema>) => {
    const { success, data} = applicantSchema.safeParse(unsafeData)

    if(!success) {
        throw new Error("Failed to applied the job")
    }

    await insertApplicant(data)
    revalidateApplicantTag(data.jobId)
}