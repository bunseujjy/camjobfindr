"use client";

import { Button } from "@/components/ui/button";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { ResumeData } from "../../schema/resumeSchema";
import ResumePreview from "./ResumePreview";
import { DownloadCloud } from "lucide-react";

interface DownloadProps {
  formData: ResumeData;
  className?: string;
}

const Download = ({ formData }: DownloadProps) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const saveResumeAsPDF = useReactToPrint({ contentRef });
  const resumeData = { ...formData };
  return (
    <div>
      <h1 className="text-md lg:text-lg font-semibold">Download Your Resume</h1>
      <p className="text-xs lg:text-sm text-muted-foreground">
        Review your details carefully before exporting your resume as a PDF.
      </p>
      <div className="flex items-center justify-center">
        <Button
          variant="outline"
          size="icon"
          title="Download"
          className="w-auto p-2"
          onClick={() => saveResumeAsPDF()}
        >
          <DownloadCloud className="h-4" />
          Download
        </Button>
      </div>
      <div className="invisible">
        <ResumePreview
          formData={resumeData}
          className="w-full h-full"
          contentRef={contentRef}
        />
      </div>
    </div>
  );
};

export default Download;
