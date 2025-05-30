import { getCurrentUser } from "@/services/clerk";
import ExploreSection from "../components/Home/ExploreSection";
import FeatureJobs from "../components/Home/FeatureJobs";
import FooterSection from "../components/Home/FooterSection";
import Hero from "../components/Home/Hero";
import ProcessSection from "../components/Home/ProcessSection";
import ReviewSection from "../components/Home/ReviewSection";
import { fetchApplicant } from "@/features/applicant/db/applicant";
import { ApplicantType } from "@/features/applicant/types/job_type";

export default async function Home() {
  const { user } = await getCurrentUser({ allData: true });
  const applicant = await fetchApplicant(user?.id as string);
  return (
    <div className="w-full h-full overflow-hidden">
      <Hero language="en" />
      <div className="px-4">
        <ExploreSection language="en" />
        <FeatureJobs
          user={user}
          applicant={applicant as unknown as ApplicantType[]}
        />
      </div>
      <ProcessSection />
      <ReviewSection />
      <FooterSection />
    </div>
  );
}
