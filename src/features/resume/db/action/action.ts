"use server";

import { ResumeData, resumeSchema } from "../../schema/resumeSchema";
import { db } from "@/drizzle/db";
import { ResumeTable } from "@/drizzle/schema/resume";
import { eq } from "drizzle-orm";
import { del, put } from "@vercel/blob";
import path from "path";
import { UserTable } from "@/drizzle/schema";
import { getCurrentUser } from "@/services/clerk";
import { ResumeValues } from "../../type/resumeType";

export async function saveResume(values: ResumeData) {
  const { id } = values;

  // Validate and parse input data
  const { photo, workExperience, education, ...resumeValues } =
    resumeSchema.parse(values);

  // Get authenticated user
  const clerkUserId = (await getCurrentUser()).clerkUserId;
  if (!clerkUserId) {
    throw new Error("User not authenticated");
  }

  const [user] = await db
    .select({ id: UserTable.id })
    .from(UserTable)
    .where(eq(UserTable.clerkUserId, clerkUserId));

  if (!user) {
    throw new Error("User not found in database");
  }

  const dbUserId = user.id;

  // Check if resume exists for update
  const [existingResume] = id
    ? await db.select().from(ResumeTable).where(eq(ResumeTable.id, id))
    : [null];

  if (id && !existingResume) {
    throw new Error("Resume not found");
  }

  // Handle photo upload - initialize as undefined instead of null
  let newPhotoUrl: string | undefined = undefined;

  if (photo instanceof Blob) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }
    const extension = path.extname(photo.name || "upload");
    const blob = await put(`resume_photos/${Date.now()}${extension}`, photo, {
      access: "public",
    });
    newPhotoUrl = blob.url;
  } else if (photo === null) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }
    newPhotoUrl = undefined; // Explicit null for removal
  }

  // Only include photo fields if they changed
  const photoFields =
    newPhotoUrl !== undefined
      ? {
          photoUrl: newPhotoUrl,
          personal_info: {
            ...(existingResume?.personal_info || {}),
            photo: newPhotoUrl,
          },
        }
      : {};

  // Common resume data
  const resumeData = {
    ...resumeValues,
    userId: dbUserId,
    general_info: {
      title: resumeValues.title ?? undefined,
      description: resumeValues.description ?? undefined,
    },
    personal_info: {
      ...(existingResume?.personal_info || {}),
      firstName: resumeValues.firstName ?? undefined,
      lastName: resumeValues.lastName ?? undefined,
      jobTitle: resumeValues.jobTitle ?? undefined,
      city: resumeValues.city ?? undefined,
      country: resumeValues.country ?? undefined,
      phone: resumeValues.phone ?? undefined,
      email: resumeValues.email ?? undefined,
      ...(photoFields.personal_info || {}),
    },
    work_experiences:
      workExperience?.map((exp) => ({
        position: exp.position ?? undefined,
        company: exp.company ?? undefined,
        description: exp.description ?? undefined,
        startDate: exp.startDate ? new Date(exp.startDate) : undefined,
        endDate: exp.endDate ? new Date(exp.endDate) : undefined,
      })) ?? undefined,
    education:
      education?.map((edu) => ({
        degree: edu.degree ?? undefined,
        school: edu.school ?? undefined,
        startDate: edu.startDate ? new Date(edu.startDate) : undefined,
        endDate: edu.endDate ? new Date(edu.endDate) : undefined,
      })) ?? undefined,
    skills: resumeValues.skills ?? undefined,
    summary: resumeValues.summary ?? undefined,
    color: resumeValues.colorHex ?? undefined,
    border: resumeValues.borderStyle ?? undefined,
    updatedAt: new Date(),
  };

  if (id) {
    return db
      .update(ResumeTable)
      .set(resumeData)
      .where(eq(ResumeTable.id, id))
      .returning();
  } else {
    return db
      .insert(ResumeTable)
      .values({
        userId: dbUserId,
        skills: resumeValues.skills || [], // Required - default empty array
        summary: resumeValues.summary || "", // Required - default empty string
        general_info: {
          title: resumeValues.title || undefined,
          description: resumeValues.description || undefined,
        },
        personal_info: {
          firstName: resumeValues.firstName || undefined,
          lastName: resumeValues.lastName || undefined,
          jobTitle: resumeValues.jobTitle || undefined,
          city: resumeValues.city || undefined,
          country: resumeValues.country || undefined,
          phone: resumeValues.phone || undefined,
          email: resumeValues.email || undefined,
          ...(newPhotoUrl !== undefined ? { photo: newPhotoUrl } : {}),
        },
        work_experiences: workExperience?.map((exp) => ({
          position: exp.position || undefined,
          company: exp.company || undefined,
          startDate: exp.startDate ? new Date(exp.startDate) : undefined,
          endDate: exp.endDate ? new Date(exp.endDate) : undefined,
        })),
        education: education?.map((edu) => ({
          degree: edu.degree || undefined,
          school: edu.school || undefined,
          startDate: edu.startDate ? new Date(edu.startDate) : undefined,
          endDate: edu.endDate ? new Date(edu.endDate) : undefined,
        })),
        color: resumeValues.colorHex || undefined,
        border: resumeValues.borderStyle || undefined,
        photoUrl: newPhotoUrl !== undefined ? newPhotoUrl : undefined,
        updatedAt: new Date(),
        createdAt: new Date(),
      })
      .returning();
  }
}
export async function duplicateResume(resumeValues: ResumeValues) {
  // Get authenticated user
  const clerkUserId = (await getCurrentUser()).clerkUserId;
  if (!clerkUserId) {
    throw new Error("User not authenticated");
  }

  const [user] = await db
    .select({ id: UserTable.id })
    .from(UserTable)
    .where(eq(UserTable.clerkUserId, clerkUserId));

  if (!user) {
    throw new Error("User not found in database");
  }
  const dbUserId = user.id;

  // Ensure required fields are present
  const valuesToInsert = {
    userId: dbUserId,
    general_info: resumeValues.general_info,
    personal_info: resumeValues.personal_info,
    work_experiences: resumeValues.work_experiences || [],
    education: resumeValues.education || [],
    skills: resumeValues.skills || [],
    summary: resumeValues.summary || "",
    color: resumeValues.color,
    border: resumeValues.border,
    updatedAt: new Date(),
    photoUrl: resumeValues.photoUrl,
  };

  const result = await db
    .insert(ResumeTable)
    .values(valuesToInsert)
    .returning();

  if (!result) {
    throw new Error("Failed to duplicate resume.");
  }

  return result;
}

export async function renameResume(id: string, title: string) {
  // Get authenticated user
  const clerkUserId = (await getCurrentUser()).clerkUserId;
  if (!clerkUserId) {
    throw new Error("User not authenticated");
  }

  const [user] = await db
    .select({ id: UserTable.id })
    .from(UserTable)
    .where(eq(UserTable.clerkUserId, clerkUserId));

  if (!user) {
    throw new Error("User not found in database");
  }

  const rename = await db
    .update(ResumeTable)
    .set({
      general_info: {
        title,
      },
    })
    .where(eq(ResumeTable.id, id))
    .returning();

  if (!rename) {
    throw new Error("Failed to rename resume");
  }

  return rename;
}

export async function deleteResume(id: string) {
  // Get authenticated user
  const clerkUserId = (await getCurrentUser()).clerkUserId;
  if (!clerkUserId) {
    throw new Error("User not authenticated");
  }

  const [user] = await db
    .select({ id: UserTable.id })
    .from(UserTable)
    .where(eq(UserTable.clerkUserId, clerkUserId));

  if (!user) {
    throw new Error("User not found in database");
  }

  const deleteResume = await db
    .delete(ResumeTable)
    .where(eq(ResumeTable.id, id))
    .returning();

  if (!deleteResume) {
    throw new Error("Failed to delete this resume");
  }

  return deleteResume;
}

export async function fetchResume() {
  try {
    const resume = await db.query.ResumeTable.findMany()

    if(!resume) {
      throw new Error("Failed to fetch resume")
    }

    return resume
  } catch (error) {
    console.error(error, "Bad Request")
  }
}