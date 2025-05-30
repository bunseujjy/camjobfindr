import { UserProfile } from "@clerk/nextjs";
import { Suspense } from "react";
import CustomPages from "./custom-page/page";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const url = `${process.env.BASE_URL}/profile`;
  return {
    title: "Your Profiles",
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
      title: "Your Profiles",
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

const ResumeClientWrapper = () => {
  return (
    <Suspense fallback={<div>Loading resume...</div>}>
      <CustomPages />
    </Suspense>
  );
};
const DotIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
      className="w-4 h-4"
    >
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
    </svg>
  );
};

export default function ProfileLayout() {
  return (
    <UserProfile path="/profile" routing="path">
      <UserProfile.Page
        label="Custom Page"
        labelIcon={<DotIcon />}
        url="custom-page"
      >
        <ResumeClientWrapper />
      </UserProfile.Page>

      {/* You can also pass the content as direct children */}
      <UserProfile.Page label="Terms" labelIcon={<DotIcon />} url="terms">
        <div>
          <h1>Custom Terms Page</h1>
          <p>This is the content of the custom terms page.</p>
        </div>
      </UserProfile.Page>
    </UserProfile>
  );
}
