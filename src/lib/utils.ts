import { ResumeData } from "@/features/resume/schema/resumeSchema"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fileReplacer(key: unknown, value: unknown) {
  return value instanceof Blob ? {
    size: value.size,
    type: value.type,
  } : value
}

export function mapToResumeValues(data: ResumeData | null) {
  // Handle case when data is null or empty array
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return {
      colorHex: "#000000", // Default color
      workExperience: [],
      education: [],
      skills: []
    };
  }

  // Get the resume object (handles both single object and array cases)
  const resume = Array.isArray(data) ? data[0] : data;

  return {
    id: resume.id,
    title: resume.general_info?.title || undefined,
    description: resume.general_info?.description || undefined,
    photo: resume.photoUrl || resume.personal_info?.photo || undefined, // Always initialize as undefined
    firstName: resume.personal_info?.firstName || undefined,
    lastName: resume.personal_info?.lastName || undefined,
    jobTitle: resume.personal_info?.jobTitle || undefined,
    city: resume.personal_info?.city || undefined,
    country: resume.personal_info?.country || undefined,
    phone: resume.personal_info?.phone || undefined,
    email: resume.personal_info?.email || undefined,
    workExperience:
      resume.work_experiences?.map((exp: workExperiences) => ({
        position: exp.position || undefined,
        company: exp.company || undefined,
        description: exp.description || undefined,
        startDate: exp.startDate?.toString().split("T")[0],
        endDate: exp.endDate?.toString().split("T")[0],
      })) || [],
    education:
      resume.education?.map((edu: education) => ({
        degree: edu.degree || undefined,
        school: edu.school || undefined,
        startDate: edu.startDate?.toString().split("T")[0],
        endDate: edu.endDate?.toString().split("T")[0],
      })) || [],
    skills: resume.skills || [],
    borderStyle: resume.border || undefined,
    colorHex: resume.color || undefined,
    summary: resume.summary || undefined,
  }
}

interface workExperiences {
  position: string;
  company: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

interface education {
  degree: string;
  school: string;
  startDate: Date;
  endDate: Date;
}