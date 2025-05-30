export type SavedJobType = {
  id: string;
  userId: string;
  jobId: string;
};


type JobPosting = {
  id: string;
  job_title: string;
  company_name: string;
  description: string;
  about_role: string;
  location: string;
  available: string | null; // Allow available to be null
  salary: string | null; // Allow salary to be null
  job_type: "full-time" | "part-time" | "remote" | "internship";
  industry: string | null; // Allow industry to be null
  skillsRequired: string[] | null; // Allow skillsRequired to be null
  experiences: string;
  companyId: string;
  postedById: string;
  createdAt: Date;
  expiresAt: Date | null;
};

type Company = {
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

type JobPostingData = {
  job_posting: JobPosting;
  company: Company | null; // Allow company to be null
};

export type JobPostingResponse = JobPostingData;