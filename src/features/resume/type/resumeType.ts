import { ResumeData } from "../schema/resumeSchema";

export type EditorFormType = {
    formData: ResumeData;
    setFormData: (data: ResumeData) => void;
}
// types/resume.ts
export interface GeneralInfo {
    title: string;
    description?: string;
  }
  
  export interface PersonalInfo {
    firstName?: string;
    lastName?: string;
    jobTitle?: string;
    city?: string;
    country?: string;
    phone?: string;
    email?: string;
    photo?: string;
  }
  
  export interface WorkExperience {
    position?: string;
    company?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
  }
  
  export interface Education {
    degree?: string;
    school?: string;
    startDate?: Date;
    endDate?: Date;
  }
  
  export interface ResumeValues {
    userId: string;
    general_info: GeneralInfo;
    personal_info: PersonalInfo;
    work_experiences?: WorkExperience[];
    education?: Education[];
    skills?: string[];
    summary?: string;
    color?: string;
    border?: string;
    updatedAt: Date;
    photoUrl?: string;
  }