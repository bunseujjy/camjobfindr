import React from "react";
import AdditionalUpdate from "./AdditionalUpdate";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const url = `${process.env.BASE_URL}/additional`;
  return {
    title: "Additional",
    description: "Edit your additional profile information.",
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
      title: "Additional",
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
const Additional = () => {
  return <AdditionalUpdate />;
};

export default Additional;
