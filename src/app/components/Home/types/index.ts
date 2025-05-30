import { ApplicantType } from "@/features/applicant/types/job_type";
import { UserData } from "@/features/users/types/type";

// JobType
export interface Job {
  guid: string | undefined;
  url: string | undefined;
  title: string | undefined;
  content_html: string | undefined;
  summary: string | undefined;
  date_published: string | undefined;
}

// CategoriesType
export interface CategoriesSectionProps {
  language: "en" | "kh";
}

// ReviewType
export type ReviewType = {
  id: number;
  name: string;
  email: string;
  logo: string;
  location: string;
  rating: number;
  review_title: string;
  review_text: string;
  review_date: string;
};

export type JobDatabaseType = {
  id: string;
  job_title: string;
  company_name: string;
  description: string;
  about_role: string;
  location: string;
  available: string | null; // Allow available to be null
  salary: string | null; // Allow salary to be null
  job_type: string;
  industry: string | null; // Allow industry to be null
  skillsRequired: string[] | null; // Allow skillsRequired to be null
  companyId: string;
  postedById: string;
  createdAt: Date;
  expiresAt: Date | null;
  company: {
    id: string;
    name: string;
    website: string | null; // Allow website to be null
    company_size: string;
    logo: string | null; // Allow logo to be null
    industry: string;
    location: string;
    email: string;
    phone_number: string | null; // Allow phone_number to be null
    description: string | null; // Allow description to be null
    facebook_url: string | null;
    linkedin_url: string | null;
    twitter_url: string | null;
    instagram_url: string | null;
    createdAt: Date;
  };
};

export type JobType = {
  job_db?: JobDatabaseType;
  feature_jobs?: Job;
  user: UserData | null;
  applicant: ApplicantType[]
  isApplied?: boolean
};
