"use client";

import React, { useEffect, useRef, useState } from "react";
import { ResumeData } from "../../schema/resumeSchema";
import { cn } from "@/lib/utils";
import useDimension from "@/hooks/useDimension";
import Image from "next/image";
import { formatDate } from "@/helper/formatDate";
import { Badge } from "@/components/ui/badge";
import { BorderStyles } from "./BorderPicker";

interface ResumePreviewProps {
  formData: ResumeData;
  className: string;
  contentRef?: React.Ref<HTMLDivElement>;
}
const ResumePreview = ({
  formData,
  className,
  contentRef,
}: ResumePreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimension(containerRef);
  return (
    <div
      className={cn(
        "aspect-[210/297] h-fit w-full bg-white text-black",
        className
      )}
      ref={containerRef}
    >
      <div
        id="resumePreviewContent"
        style={{ zoom: (1 / 794) * width }}
        className={cn("space-y-6 p-6", !width && "invisible")}
        ref={contentRef}
      >
        <HeaderPreviewSection formData={formData} />
        <SummaryPreview formData={formData} />
        <WorkExperiencePreview formData={formData} />
        <EducationPreview formData={formData} />
        <SkillPreviewSection formData={formData} />
      </div>
    </div>
  );
};

export default ResumePreview;

interface PreviewProps {
  formData: ResumeData;
}

function HeaderPreviewSection({ formData }: PreviewProps) {
  const {
    photo,
    firstName,
    lastName,
    jobTitle,
    city,
    country,
    phone,
    email,
    colorHex,
    borderStyle,
  } = formData;
  const [photoSrc, setPhotoSrc] = useState(photo instanceof Blob ? "" : photo);

  useEffect(() => {
    const objectUrl = photo instanceof Blob ? URL.createObjectURL(photo) : "";
    if (objectUrl) setPhotoSrc(objectUrl);
    if (photo === null) setPhotoSrc("");
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  return (
    <div className="flex items-center gap-6">
      {photoSrc && (
        <Image
          src={photoSrc}
          alt="profile image"
          width={100}
          height={100}
          className="aspect-square object-cover"
          style={{
            borderRadius:
              borderStyle === BorderStyles.SQUARE
                ? "0px"
                : borderStyle === BorderStyles.CIRCLE
                ? "9999px"
                : "10%",
          }}
        />
      )}
      <div className="space-y-2 5">
        <div className="space-y-1">
          <p className="text-3xl font-bold" style={{ color: colorHex }}>
            {firstName} {lastName}
          </p>
          <p className="font-medium" style={{ color: colorHex }}>
            {jobTitle}
          </p>
        </div>
        <p className="text-xs text-gray-500">
          {city}
          {city && country ? "," : ""}
          {country}
          {city || (country && phone) || email ? " • " : ""}
          {[phone, email].filter(Boolean).join(" • ")}
        </p>
      </div>
    </div>
  );
}

function SummaryPreview({ formData }: PreviewProps) {
  const { summary, colorHex } = formData;

  if (!summary) return null;
  return (
    <>
      <hr className="border" style={{ borderColor: colorHex }} />
      <div className="break-inside-avoid space-y-3">
        <p className="text-lg font-bold" style={{ color: colorHex }}>
          Summary
        </p>
        <div className="white-space-pre-line text-sm">{summary}</div>
      </div>
    </>
  );
}

function WorkExperiencePreview({ formData }: PreviewProps) {
  const { workExperience, colorHex } = formData;

  const workExperienceNotEmpty = workExperience?.filter(
    (work) => Object.values(work).filter(Boolean).length > 0
  );

  if (!workExperienceNotEmpty?.length) return null;
  return (
    <>
      <hr className="border" style={{ borderColor: colorHex }} />
      <div className="space-y-3">
        <h1 className="text-md font-semibold" style={{ color: colorHex }}>
          Work Experience
        </h1>
        <div className="space-y-4">
          {workExperienceNotEmpty?.map((work, idx) => (
            <div key={idx} className="break-inside-avoid space-y-1">
              <div className="flex items-center justify-between">
                <span style={{ color: colorHex }}>{work.position}</span>
                {work.startDate && (
                  <span style={{ color: colorHex }}>
                    {formatDate(work.startDate)} -{" "}
                    {work.endDate ? formatDate(work.endDate) : "Present"}
                  </span>
                )}
              </div>
              <p>{work.company}</p>
              <div className="text-xs space-y-1">
                {work.description?.split("\n").map((line, i) => (
                  <p key={i} className="flex">
                    {line.trim().startsWith("•") ||
                    line.trim().startsWith("-") ? (
                      <span>{line}</span>
                    ) : (
                      <span>{line}</span>
                    )}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function EducationPreview({ formData }: PreviewProps) {
  const { education, colorHex } = formData;

  const educationNotEmpty = education?.filter(
    (work) => Object.values(work).filter(Boolean).length > 0
  );

  if (!educationNotEmpty?.length) return null;
  return (
    <>
      <hr className="border" style={{ borderColor: colorHex }} />
      <div className="space-y-3">
        <h1 className="text-md font-semibold" style={{ color: colorHex }}>
          Education
        </h1>
        {educationNotEmpty?.map((edu, idx) => (
          <div key={idx} className="break-inside-avoid space-y-1">
            <div className="flex items-center justify-between">
              <span>{edu.degree}</span>
              {edu.startDate && (
                <span style={{ color: colorHex }}>
                  {formatDate(edu.startDate)} -{" "}
                  {edu.endDate ? formatDate(edu.endDate) : "Present"}
                </span>
              )}
            </div>
            <p>{edu.school}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function SkillPreviewSection({ formData }: PreviewProps) {
  const { skills, colorHex, borderStyle } = formData;
  if (!skills?.length) return null;

  return (
    <>
      <hr className="border" style={{ borderColor: colorHex }} />
      <div className="break-inside avoid space-y-3">
        <p className="text-lg font-semibold" style={{ color: colorHex }}>
          Skills
        </p>
        <div className="flex break-inside-avoid flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <Badge
              key={idx}
              style={{
                backgroundColor: colorHex,
                borderRadius:
                  borderStyle === BorderStyles.SQUARE
                    ? "0px"
                    : borderStyle === BorderStyles.CIRCLE
                    ? "9999px"
                    : "8px",
              }}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
}
