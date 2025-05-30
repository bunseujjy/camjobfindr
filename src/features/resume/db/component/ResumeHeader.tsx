import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { steps } from "../../steps";

interface BreadcrumbProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
}

const ResumeHeader = ({ currentStep, setCurrentStep }: BreadcrumbProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {steps.map((step) => (
          <React.Fragment key={step.key}>
            <BreadcrumbItem>
              {step.key === currentStep ? (
                <BreadcrumbPage>{step.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  asChild
                  onClick={() => setCurrentStep(step.key)}
                >
                  <button>{step.title}</button>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default ResumeHeader;
