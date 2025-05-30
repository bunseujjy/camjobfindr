import React, { Suspense } from "react";
import { CompanyTable, CompanyUserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { getCurrentUser } from "@/services/clerk";
import JobEditing from "./JobEditing";
import { getJobById } from "@/features/job/actions/job";
import { redirect } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Metadata generation (separate from page component)
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const jobId = id;
  return {
    title: `Editing Job ${jobId}`,
    description: `Edit job posting ${jobId}`,
  };
}

async function getCompany(userId: string) {
  "use cache";
  const company = await db
    .select({
      userId: CompanyUserTable.userId,
      companyId: CompanyTable.id,
      name: CompanyTable.name,
    })
    .from(CompanyUserTable)
    .leftJoin(CompanyTable, eq(CompanyUserTable.companyId, CompanyTable.id))
    .where(eq(CompanyUserTable.userId, userId));

  return company.length ? company : null;
}

export default async function JobEditingPage({ params }: PageProps) {
  const { id } = await params;
  const jobId = id;
  const { userId } = await getCurrentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  const [company, job] = await Promise.all([
    getCompany(userId as string),
    getJobById(jobId),
  ]);

  if (!company || !job || company.find((c) => c.userId !== userId)) {
    redirect("/onboarding");
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {" "}
      <JobEditing companies={company} job={job} userId={userId} jobId={jobId} />
    </Suspense>
  );
}
