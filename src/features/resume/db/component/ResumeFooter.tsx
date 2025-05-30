"use client";

import { Button } from "@/components/ui/button";
import { steps } from "../../steps";
import Link from "next/link";
import { FileIcon as FileUserIcon, PenLineIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResumeFooterProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
  showSmResumePreview: boolean;
  setShowSmResumePreview: (data: boolean) => void;
  isSaving: boolean;
}

const ResumeFooter = ({
  currentStep,
  setCurrentStep,
  showSmResumePreview,
  setShowSmResumePreview,
  isSaving,
}: ResumeFooterProps) => {
  const nextStep = steps.find(
    (_, index) => steps[index - 1]?.key === currentStep
  )?.key;
  const prevStep = steps.find(
    (_, index) => steps[index + 1]?.key === currentStep
  )?.key;
  return (
    <footer className="w-full bg-white border shadow-sm py-4">
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <Button
            onClick={prevStep ? () => setCurrentStep(prevStep) : undefined}
            variant="secondary"
          >
            Prev
          </Button>
          <Button
            onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
          >
            Next
          </Button>
        </div>

        {/* Middle section */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            title={
              showSmResumePreview ? "Show input form" : "Show resume preview"
            }
            onClick={() => setShowSmResumePreview(!showSmResumePreview)}
            className="md:hidden"
          >
            {showSmResumePreview ? <PenLineIcon /> : <FileUserIcon />}
          </Button>
        </div>

        {/* Right section */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" asChild>
            <Link href="/resumes">Close</Link>
          </Button>
          <p
            className={cn(
              "text-muted-foreground opacity-0",
              isSaving && "opacity-80"
            )}
          >
            Saving....
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ResumeFooter;
