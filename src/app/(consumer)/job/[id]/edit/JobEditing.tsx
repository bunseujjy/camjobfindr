"use client";

import Tiptap from "@/app/components/TextEditor/Tiptap";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateJob } from "@/features/job/actions/job";
import { jobSchema } from "@/features/job/schema/jobSchema";
import { JobPostingResponse } from "@/features/job/types/jobsType";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type JobFormValues = z.infer<typeof jobSchema>;

interface JobEditingProps {
  companies: {
    userId: string;
    companyId: string | null;
    name: string | null;
  }[];
  job: JobPostingResponse | null;
  userId: string | undefined;
  jobId: string;
}

const JobEditing = ({ companies, job, userId, jobId }: JobEditingProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [skills, setSkills] = useState<string[]>(
    job?.job_posting?.skillsRequired as string[]
  );
  const company = companies.find((c) => c.userId === userId);
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      job_title: job?.job_posting?.job_title,
      company_name: company?.name as string,
      job_type: job?.job_posting?.job_type,
      location: job?.job_posting?.location,
      industry: job?.job_posting?.industry as string,
      skillsRequired: job?.job_posting?.skillsRequired as string[],
      salary: job?.job_posting?.salary as string,
      available: job?.job_posting?.available as "open" | "closed",
      description: job?.job_posting?.description,
      about_role: job?.job_posting?.about_role,
      companyId: company?.companyId as string,
      postedById: userId,
    },
  });

  const handleKeyDown = (
    field: ControllerRenderProps<JobFormValues, "skillsRequired">,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputValue.trim()) {
        const newSkills = [...skills, inputValue.trim()];
        setSkills(newSkills);
        field.onChange(newSkills);
        setInputValue("");
      }
    }
  };

  const removeSkill = (
    field: ControllerRenderProps<JobFormValues, "skillsRequired">,
    skillToRemove: string
  ) => {
    const newSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(newSkills);
    field.onChange(newSkills);
  };

  const onSubmit = async (data: JobFormValues) => {
    try {
      setIsSubmitting(true);
      await updateJob(jobId, data);
      toast.success("Job Updated Successfully");
      form.reset({
        job_title: "",
        company_name: company?.name as string,
        job_type: "full-time",
        description: "",
        location: "",
        industry: "",
        skillsRequired: [],
        salary: "",
        companyId: company?.companyId as string,
        postedById: userId,
        available: "open", // Make sure to include all fields
        about_role: "", // Include this if it's in your schema
      });
      setSkills([]);
    } catch (error) {
      console.error("Job updating error:", error);
      toast.error("There was a problem updating your job.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto w-full min-h-screen p-4 sm:p-6 md:p-8 my-10 rounded-md">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-md p-4">
        <h1 className="text-lg md:text-xl lg:text-2xl xl:text-4xl">
          Post a New Job
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full h-full py-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="job_title"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel className="pr-1">Job Title</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input {...field} placeholder="Enter job title" />
                  </FormControl>
                  <FormDescription>
                    The title of the job position you&#39;re hiring for.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel className="pr-1">Company Name</FormLabel>
                    <FormMessage />
                  </div>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={company?.name as string}>
                        {company?.name}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The name of your company or organization.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="job_type"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel className="pr-1">Job Types</FormLabel>
                    <FormMessage />
                  </div>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Job Types" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="full-time">Full-Time</SelectItem>
                      <SelectItem value="part-time">Part-Time</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The type of employment for this position.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel className="pr-1">Industry</FormLabel>
                    <FormMessage />
                  </div>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">
                        Manufacturing
                      </SelectItem>
                      <SelectItem value="hospitality">Hospitality</SelectItem>
                      <SelectItem value="media">
                        Media & Entertainment
                      </SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="agriculture">Agriculture</SelectItem>
                      <SelectItem value="energy">Energy</SelectItem>
                      <SelectItem value="transportation">
                        Transportation
                      </SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="nonprofit">Non-Profit</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Industry of the job.</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="available"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Availablity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel className="pr-1">Salary</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="Enter salary amount"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the salary amount in numbers only
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skillsRequired"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel className="pr-1">Skills</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <div>
                      <Input
                        placeholder="e.g. Next.js (Press Enter or comma to add)"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(field, e)}
                      />
                      <div className="mt-2 flex flex-wrap gap-2">
                        {skills.map((skill: string, index: number) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => removeSkill(field, skill)}
                            className="flex items-center border rounded-md ml-1 text-xs p-2"
                          >
                            {skill}{" "}
                            <span>
                              <X size={12} />
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter skills and press Enter or comma to add them
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel className="pr-1">Location</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Dangkao, Phnom Penh" />
                  </FormControl>
                  <FormDescription>
                    Where the job is located or if it&#39;s remote.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel className="pr-1">Description</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Tiptap
                      content={field.value || ""}
                      onChange={(value) => field.onChange(value)}
                      placeholder={`e.g. We are looking for a Senior Frontend Developer to join our team and help us build amazing user experiences. You will work closely with our design and backend teams to implement new features and improve existing ones.
                        • Requirements:
                        • Strong understanding of modern JavaScript
                        • Familiarity with Next.js

                        • What we offer:
                        • Competitive salary and equity
                        • Health, dental, and vision insurance`}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of the job.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="about_role"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel className="pr-1">About Role</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Tiptap
                      content={field.value || ""}
                      onChange={(value) => field.onChange(value)}
                      placeholder={`e.g. As a Senior Frontend Developer at Acme Inc., you will be responsible for building and maintaining our web applications. You will work with a team of talented developers to create intuitive and responsive user interfaces.
                      Responsibilities:
                      • Develop new features and improve existing ones
                      • Write clean, maintainable, and efficient code
                      • Collaborate with designers and backend developers
                      • Participate in code reviews
                      • Mentor junior developers`}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed role of the job.
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
};

export default JobEditing;
