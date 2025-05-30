import React, { Suspense } from "react";
import NewJob from "./NewJob";
import { CompanyTable, CompanyUserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { getCurrentUser } from "@/services/clerk";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const url = `${process.env.BASE_URL}/new_listing`;
  return {
    title: "Create a new jobs",
    description: "Create jobs here.",
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
      title: "Create a new jobs",
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

  if (company.length === 0) {
    return null;
  }
  return company;
}

const NewListingPage = async () => {
  const { userId } = await getCurrentUser();
  const company = await getCompany(userId as string);
  if (company?.find((c) => c.userId !== userId) || !company) {
    redirect("/onboarding");
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewJob companies={company} userId={userId} />
    </Suspense>
  );
};

export default NewListingPage;
