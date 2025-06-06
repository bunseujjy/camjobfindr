"use server";

import { z } from "zod";
import { jobSchema } from "../schema/jobSchema";
import { insertJob, updatingJob } from "../db/job";
import { db } from "@/drizzle/db";
import {
  CompanyTable,
  JobPostingTable,
} from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function createJob(unsafeData: z.infer<typeof jobSchema>) {
  const { success, data } = jobSchema.safeParse(unsafeData);

  if (!success) {
    return { error: true, message: "There was an error creating job" };
  }

  await insertJob(data);
}

export async function updateJob(jobId: string, unsafeData: z.infer<typeof jobSchema>) {
  const { success, data } = jobSchema.safeParse(unsafeData);

  if (!success) {
    return { error: true, message: "There was an error updating job" };
  }

  await updatingJob(jobId, data);
}

export async function fetchDBJob() {
  try {
    const data = await db.query.JobPostingTable.findMany({
      with: {
        company: true,
      },
    });

    if (!data) {
      throw new Error("Job not found");
    }
    return JSON.parse(JSON.stringify(data)); // Convert to plain object
  } catch (error) {
    console.error(error);
  }
}

export async function getJobById(jobId: string) {
  const job = await db
    .select()
    .from(JobPostingTable)
    .where(eq(JobPostingTable.id, jobId))
    .leftJoin(CompanyTable, eq(JobPostingTable.companyId, CompanyTable.id));

  return job[0];
}


export async function getJob() {
  "use cache";

  const job = await db
    .select()
    .from(JobPostingTable)
    .leftJoin(CompanyTable, eq(JobPostingTable.companyId, CompanyTable.id));

  return job;
}

export async function getAllJob() {

  const job = await db
    .select()
    .from(JobPostingTable)
    .leftJoin(CompanyTable, eq(JobPostingTable.companyId, CompanyTable.id))

  return job;
}


export async function getSavedJobs(userId: string) {
    try {
      const data = await db.query.SavedJobsTable.findMany({
        where: (savedJob, { eq }) => eq(savedJob.userId, userId),
      });
      if (!data) {
        throw new Error("Failed to fetching Saved Job");
      }
  
      return data
    } catch (error) {
      console.error(error, "Bad Request");
    }
  }