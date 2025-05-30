"use server";

import { db } from "@/drizzle/db";
import {
  JobPostingTable,
  CompanyTable,
  UserTable,
  SavedJobsTable,
} from "@/drizzle/schema";
import { revalidateJobTag } from "./cache";
import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export const insertJob = async (data: typeof JobPostingTable.$inferInsert) => {
  // Validate required fields
  if (
    !data.job_title ||
    !data.company_name ||
    !data.description ||
    !data.about_role ||
    !data.location ||
    !data.job_type ||
    !data.industry ||
    !data.companyId ||
    !data.postedById
  ) {
    throw new Error("Missing required fields");
  }

  // Check if the company exists
  const company = await db
    .select()
    .from(CompanyTable)
    .where(eq(CompanyTable.id, data.companyId))
    .limit(1);

  if (!company[0]) {
    throw new Error("Company does not exist");
  }

  // Check if the user exists
  const user = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.id, data.postedById))
    .limit(1);

  if (!user[0]) {
    throw new Error("User does not exist");
  }

  // Insert the job
  const [newJob] = await db.insert(JobPostingTable).values(data).returning();

  if (!newJob) {
    throw new Error("Failed to create a job");
  }

  // Revalidate cache
  revalidateJobTag(newJob.id);

  return newJob;
};

export async function savedJobs(userId: string, jobId: string) {
  try {
    const user = await auth();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const saveJob = await db
      .insert(SavedJobsTable)
      .values({
        userId,
        jobId,
      })
      .returning();

    if (!saveJob[0]) {
      throw new Error("Failed to save job.");
    }

    return saveJob;
  } catch (error) {
    console.error(error, "Bad Request");
  }
}

export async function removeFromSaved(jobId: string) {
  try {
    const user = await auth();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const removeSave = await db
      .delete(SavedJobsTable)
      .where(eq(SavedJobsTable.jobId, jobId))
      .returning();

    if (!removeSave[0]) {
      throw new Error("Failed to remove this job from your saved list");
    }

    return removeSave;
  } catch (error) {
    console.error(error, "Bad Request");
  }
}

export async function updatingJob(
  jobId: string,
  data: typeof JobPostingTable.$inferInsert
) {
  try {
  
  // Check if the company exists
  const company = await db
    .select()
    .from(CompanyTable)
    .where(eq(CompanyTable.id, data.companyId))
    .limit(1);

  if (!company[0]) {
    throw new Error("Company does not exist");
  }

  // Check if the user exists
  const user = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.id, data.postedById))
    .limit(1);

  if (!user[0]) {
    throw new Error("User does not exist");
  }

    const updatingData = await db
      .update(JobPostingTable)
      .set(data)
      .where(eq(JobPostingTable.id, jobId))
      .returning();

    if (!updatingData) {
      throw new Error("Failed to updating status");
    }

    return updatingData;
  } catch (error) {
    console.error(error, "Bad Request");
  }
}

export async function updatingJobStatus(
  jobId: string,
  available: "open" | "closed",
  postedById: string
) {
  try {
    // Check if the user exists
    const user = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.id, postedById))
      .limit(1);

    if (!user[0]) {
      throw new Error("User does not exist");
    }

    const updatingStatus = await db
      .update(JobPostingTable)
      .set({ available })
      .where(eq(JobPostingTable.id, jobId))
      .returning();

    if (!updatingStatus) {
      throw new Error("Failed to updating status");
    }

    return updatingStatus;
  } catch (error) {
    console.error(error, "Bad Request");
  }
}

export async function removeJob(jobId: string, postedById: string) {
  try {
    // Verify user exists and owns the job
    const [job] = await db
      .select()
      .from(JobPostingTable)
      .where(
        and(
          eq(JobPostingTable.id, jobId),
          eq(JobPostingTable.postedById, postedById)
        )
      )
      .limit(1);

    if (!job) {
      throw new Error("Job not found or you don't have permission to delete it");
    }

    // Perform deletion with transaction if needed
    const result = await db.transaction(async (tx) => {
      // Optionally delete related records first
      // await tx.delete(ApplicationTable).where(eq(ApplicationTable.jobId, jobId));
      
      // Delete the job
      const deleteResult = await tx
        .delete(JobPostingTable)
        .where(eq(JobPostingTable.id, jobId));

      return deleteResult;
    });

    // In Drizzle, delete returns { rowCount: number }
    return result.rowCount > 0;
  } catch (error) {
    console.error("Failed to delete job:", error);
    throw error; // Re-throw to handle in UI
  }
}