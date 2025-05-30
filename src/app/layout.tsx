import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import TanstackProvider from "@/provider/TanstackQuery";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const ItimFont = Jost({
  variable: "--font-geist-sans",
  subsets: ["latin-ext"],
  style: "normal",
  display: "swap",
  weight: "400",
});

// Metadata configuration
export const metadata: Metadata = {
  metadataBase: new URL(`${process.env.BASE_URL}`),
  title: {
    default: "Homepage - CamJobFindr (CJF)",
    template: "%s - CamJobFindr (CJF)",
  },
  description:
    "CamJobFindr (CJF) is Cambodia’s trusted platform for job seekers and employers. Explore curated job listings, career resources, and employer profiles to grow your career.",
  applicationName: "CamJobFindr",
  keywords: ["job", "job finder", "career", "cambodia"],
  authors: [{ name: "Eng Bunseu", url: `${process.env.BASE_URL}` }],
  creator: "Eng Bunseu",
  publisher: "Eng Bunseu",
  openGraph: {
    title:
      "CamJobFindr (CJF) is Cambodia’s trusted platform for job seekers and employers. Explore curated job listings, career resources, and employer profiles to grow your career.",
    description:
      "CamJobFindr (CJF) is Cambodia’s trusted platform for job seekers and employers. Explore curated job listings, career resources, and employer profiles to grow your career.",
    images: [
      {
        url: "/opengraph_image.jpg",
        width: 1200,
        height: 630,
        alt: "CamJobFindr Banner",
      },
    ],
    type: "website",
    locale: "en_US",
    url: `${process.env.BASE_URL}`,
    siteName: "CamJobFindr",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "CamJobFindr (CJF) is Cambodia’s trusted platform for job seekers and employers. Explore curated job listings, career resources, and employer profiles to grow your career.",
    description:
      "CamJobFindr (CJF) is Cambodia’s trusted platform for job seekers and employers. Explore curated job listings, career resources, and employer profiles to grow your career.",

    images: ["/opengraph_image.jpg"],
    site: "@MijuDramaInfo",
    creator: "@EngBunseu",
  },
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon", sizes: "any" }],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: [{ url: "/apple-touch-icon.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning={true}>
        <body className={`${ItimFont.className} antialiased`}>
          <TanstackProvider>
            {children}
            <Toaster />
          </TanstackProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
