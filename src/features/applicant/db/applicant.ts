"use server";

import { db } from "@/drizzle/db";
import {
  ApplicationStatus,
  ApplicationTable,
  JobPostingTable,
  ResumeTable,
  UserTable,
} from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export const insertApplicant = async (
  data: typeof ApplicationTable.$inferInsert
) => {
  // Validate input
  if (!data.jobId || !data.userId || !data.resume) {
    throw new Error("Missing required fields: jobId, userId, or resume");
  }

  // Check if user is jobSeeker
  const [user] = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.id, data.userId))
    .limit(1);

  if (!user || user.role !== "jobSeeker") {
    throw new Error("Only job seekers can apply for jobs");
  }

  // Check resume exists
  const [resume] = await db
    .select()
    .from(ResumeTable)
    .where(eq(ResumeTable.userId, data.userId))
    .limit(1);

  if (!resume) {
    throw new Error("Resume not found - please upload a resume first");
  }

  // Check job exists
  const [job] = await db
    .select()
    .from(JobPostingTable)
    .where(eq(JobPostingTable.id, data.jobId))
    .limit(1);

  if (!job) {
    throw new Error("Job not found");
  }

  // Check for existing application
  const existingApp = await db.query.ApplicationTable.findFirst({
    where: and(
      eq(ApplicationTable.userId, data.userId),
      eq(ApplicationTable.jobId, data.jobId)
    ),
  });

  if (existingApp) {
    throw new Error("You've already applied to this job");
  }

  // Create application
  const [application] = await db
    .insert(ApplicationTable)
    .values(data)
    .returning();

  if (!application) {
    throw new Error("Failed to submit application");
  }

  return application;
};
export const updateApplicationStatus = async (
  applicationId: string,
  status: ApplicationStatus
) => {
  const [updatedApplication] = await db
    .update(ApplicationTable)
    .set({ status })
    .where(eq(ApplicationTable.id, applicationId))
    .returning();

  if (!updatedApplication) {
    throw new Error("Failed to update application status");
  }

  return updatedApplication;
};

export const fetchApplicant = async (userId: string) => {
  const applicant = await db.query.ApplicationTable.findMany({
    where: (app, { eq }) => eq(app.userId, userId),
  });

  if (!applicant) {
    throw new Error("Failed to fetch applicant");
  }

  return applicant;
};

export const fetchAllApplicant = async () => {
  const applicant = await db.query.ApplicationTable.findMany({
    with: {
      resume: true
    }
  });

  if (!applicant) {
    throw new Error("Failed to fetch applicant");
  }

  return applicant;
};
