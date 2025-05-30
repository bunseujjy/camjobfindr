"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { steps } from "../../steps";
import ResumeHeader from "./ResumeHeader";
import ResumeFooter from "./ResumeFooter";
import { ResumeData } from "../../schema/resumeSchema";
import dynamic from "next/dynamic";
import ColorPicker from "./ColorPicker";
import BorderPicker from "./BorderPicker";
import { cn, mapToResumeValues } from "@/lib/utils";
import useAutoSave from "@/hooks/useAutoSave";
import useUnloadWarning from "@/hooks/useUnloadWarning";
const ResumePreview = dynamic(() => import("./ResumePreview"), {
  ssr: false,
});

interface ResumeEditorProps {
  resumeData: ResumeData | null;
}

const ResumeEditor = ({ resumeData }: ResumeEditorProps) => {
  const searchParams = useSearchParams();
  const currentStep = searchParams.get("step") || steps[0].key;
  // Apply the mapping function safely
  const initialData = resumeData ? mapToResumeValues(resumeData) : {};
  const [formData, setFormData] = useState<ResumeData>(initialData);

  const [showSmResumePreview, setShowSmResumePreview] =
    useState<boolean>(false);
  const { isSaving, hasUnsavedData } = useAutoSave(formData);

  useUnloadWarning(hasUnsavedData);

  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("step", key);
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  }

  const FormComponent = steps.find(
    (step) => step.key === currentStep
  )?.component;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border py-5 text-center">
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold">
          Design Your Resume
        </h1>
        <p>
          Follow the steps below to create your resume. Your progress will be
          saved automatically.
        </p>
      </header>
      <main className="flex flex-1 overflow-hidden">
        {/* Left Content */}
        <div
          className={cn(
            "w-full md:w-1/2 md:block flex flex-col",
            showSmResumePreview && "hidden"
          )}
        >
          <div className="p-4">
            <ResumeHeader currentStep={currentStep} setCurrentStep={setStep} />
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {FormComponent && (
              <div>
                <FormComponent formData={formData} setFormData={setFormData} />
              </div>
            )}
          </div>
        </div>

        {/* Border Divider */}
        <div className="hidden md:block border-r border-black w-px" />

        {/* Right Content (Preview) */}
        <div
          className={cn(
            "relative hidden md:flex w-full md:w-1/2",
            showSmResumePreview && "flex"
          )}
        >
          <div className="absolute left-1 top-1 flex flex-col gap-3 flex-none lg:left-3 lg:top-3">
            <ColorPicker
              color={formData.colorHex}
              onChange={(color) =>
                setFormData({ ...formData, colorHex: color.hex })
              }
            />
            <BorderPicker
              border={formData.borderStyle}
              onChange={(borderStyle) =>
                setFormData({ ...formData, borderStyle })
              }
            />
          </div>
          <div className="w-full overflow-y-auto bg-secondary p-3 flex justify-center">
            <ResumePreview
              formData={formData}
              className="w-full max-w-4xl shadow-md" // Increased max width but still centered
            />
          </div>
        </div>
      </main>
      <footer className="border-t">
        <ResumeFooter
          currentStep={currentStep}
          setCurrentStep={setStep}
          showSmResumePreview={showSmResumePreview}
          setShowSmResumePreview={setShowSmResumePreview}
          isSaving={isSaving}
        />
      </footer>
    </div>
  );
};

export default ResumeEditor;
