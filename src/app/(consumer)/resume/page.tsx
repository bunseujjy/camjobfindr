import React from "react";
import ResumeListingPage from "./ResumeListingPage";
import { getCurrentUser } from "@/services/clerk";
import { ResumeTable, UserTable } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { ResumeData } from "@/features/resume/schema/resumeSchema";
import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, LogIn } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const url = `${process.env.BASE_URL}/resume`;
  return {
    title: "Resumes",
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
      title: "Your resume listed here.",
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

const ResumePage = async () => {
  // Get authenticated user
  const clerkUserId = (await getCurrentUser()).clerkUserId;
  if (!clerkUserId) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary/10 p-6 rounded-full mb-6">
            <FileText className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            Create Professional Resumes
          </h1>
          <p className="text-muted-foreground max-w-md mb-8">
            Sign in to create, manage, and download professional resumes
            tailored to your career goals.
          </p>
          <Link href="/sign-in">
            <Button size="lg" className="gap-2">
              <LogIn className="h-4 w-4" />
              Sign In to Continue
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  const [user] = await db
    .select({ id: UserTable.id })
    .from(UserTable)
    .where(eq(UserTable.clerkUserId, clerkUserId));

  if (!user) {
    return null;
  }
  const dbUserId = user.id;

  const resumeData = await db.query.ResumeTable.findMany({
    where: and(eq(ResumeTable.userId, dbUserId)),
    with: {
      user: true,
    },
  });

  return (
    <>
      <ResumeListingPage resumeData={resumeData as ResumeData[]} />
    </>
  );
};

export default ResumePage;
