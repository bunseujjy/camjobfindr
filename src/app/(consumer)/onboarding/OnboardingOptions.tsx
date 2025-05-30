"use client";

import { Button } from "@/components/ui/button";
import { Building2, Loader2, User } from "lucide-react";
import CompanyRegistrationForm from "./CompanyForm";
import { updateUserRole } from "@/features/users/actions/uesrs";
import { UserType } from "@/features/users/types/type";
import { toast } from "sonner";
import { useState } from "react";

export interface OnboardingOptionsProps {
  user: UserType;
}
export default function OnboardingOptions({ user }: OnboardingOptionsProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleContinue = async () => {
    if (!user.clerkUserId) {
      console.error("No clerk user ID found");
      return;
    }
    if (selectedOption === "JobSeeker") {
      toast("You're now a JobSeeker");
      await updateUserRole({
        id: user.userId as string,
        role: "jobSeeker",
      });
    } else if (selectedOption === "Company") {
      setIsModalOpen(true);
    }
    setLoading(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      {!isModalOpen ? (
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-blue-600 p-8 text-white flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Welcome to CamJobFindr
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                Your gateway to exciting career opportunities and top talent.
              </p>
            </div>
            <div className="md:w-1/2 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Choose your path
              </h2>
              <div className="space-y-6 relative z-0">
                <div className="space-y-4">
                  <Button
                    variant={
                      selectedOption === "Company" ? "default" : "outline"
                    }
                    className={`w-full justify-start text-left h-auto py-4 px-6 ${
                      selectedOption === "Company"
                        ? "bg-blue-50 text-blue-600 border-blue-200"
                        : "text-gray-600"
                    }`}
                    onClick={() => handleOptionSelect("Company")}
                  >
                    <Building2 className="h-6 w-6 mr-4" />
                    <div>
                      <div className="font-semibold">
                        Company / Organization
                      </div>
                      <div className="text-sm opacity-70">
                        Post jobs and find great talent
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant={
                      selectedOption === "JobSeeker" ? "default" : "outline"
                    }
                    className={`w-full justify-start text-left h-auto py-4 px-6 ${
                      selectedOption === "JobSeeker"
                        ? "bg-blue-50 text-blue-600 border-blue-200"
                        : "text-gray-600"
                    }`}
                    onClick={() => handleOptionSelect("JobSeeker")}
                  >
                    <User className="h-6 w-6 mr-4" />
                    <div>
                      <div className="font-semibold">Job Seeker</div>
                      <div className="text-sm opacity-70">
                        Find your dream job
                      </div>
                    </div>
                  </Button>
                  <Button
                    className="w-full py-3 text-lg font-semibold"
                    disabled={!selectedOption}
                    onClick={handleContinue}
                  >
                    {loading && <Loader2 className="animate-spin" />}
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <CompanyRegistrationForm user={user} />
      )}
    </main>
  );
}
