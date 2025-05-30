import ResumeEditor from "@/features/resume/db/component/ResumeEditor";
import React from "react";
import { db } from "@/drizzle/db";
import { ResumeTable, UserTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { getCurrentUser } from "@/services/clerk";
import { ResumeData } from "@/features/resume/schema/resumeSchema";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const url = `${process.env.BASE_URL}/new_resume`;
  return {
    title: "Create your resume",
    description: "Create free resume here.",
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
      title: "Create your resume",
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

interface ResumeProps {
  searchParams: Promise<{ resumeId?: string }>;
}
const NewResume = async ({ searchParams }: ResumeProps) => {
  const { resumeId } = await searchParams;
  // Get authenticated user
  const clerkUserId = (await getCurrentUser()).clerkUserId;
  if (!clerkUserId) {
    return null;
  }
  const [user] = await db
    .select({ id: UserTable.id })
    .from(UserTable)
    .where(eq(UserTable.clerkUserId, clerkUserId));

  if (!user) {
    return null;
  }

  const dbUserId = user.id;

  const resumeData = resumeId
    ? await db.query.ResumeTable.findMany({
        where: and(
          eq(ResumeTable.id, resumeId),
          eq(ResumeTable.userId, dbUserId)
        ),
        with: {
          user: true,
        },
      })
    : null;
  return <ResumeEditor resumeData={resumeData as ResumeData | null} />;
};

export default NewResume;
