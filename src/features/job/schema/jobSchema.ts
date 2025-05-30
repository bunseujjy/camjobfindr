import { z } from "zod";

export const jobSchema = z.object({
  job_title: z.string().min(1, "Job title is required"),
  company_name: z.string().min(1, "Company name is required"),
  job_type: z.enum(["full-time", "part-time", "remote", "internship"]),
  industry: z.string().min(1, "Industry is required"),
  experience: z.string().min(1, "Experiences must be a 1 year+"),
  salary: z.string().min(1, "Salary must be a positive number"),
  skillsRequired: z.array(z.string()),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  about_role: z.string().min(1, "About Role is required"),
  available: z.enum(['open', 'closed']),
  companyId: z.string(),
  postedById: z.string()
});