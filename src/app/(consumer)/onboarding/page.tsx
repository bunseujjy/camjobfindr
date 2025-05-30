import { getCurrentUser } from "@/services/clerk";
import OnboardingOptions from "./OnboardingOptions";
import { Suspense } from "react";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const url = `${process.env.BASE_URL}/onboarding`;
  return {
    title: "Onboarding",
    description: "Decide your roles here.",
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
      title: "Onboarding",
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

export default async function OnboardingPage() {
  const user = await getCurrentUser({ allData: true });
  if (!user) {
    return null;
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardingOptions user={user} />
    </Suspense>
  );
}
