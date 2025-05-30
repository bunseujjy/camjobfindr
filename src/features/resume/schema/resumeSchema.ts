import { z } from "zod";

export const optionalType = z.string().trim().optional().or(z.literal(""))

export const generalInfoSchema = z.object({
    title: optionalType,
    description: optionalType
})

export type GeneralInfoValues = z.infer<typeof generalInfoSchema>

export const personalInfoSchema = z.object({
    photo: z.custom<File | undefined>().refine((file) => 
        !file || (file instanceof Blob && file.type.startsWith("image/")),
        "Must be an image file."
    ).refine((file) => !file || file.size <= 1024 * 1024 * 4, "File must be less than 4MB."),
    firstName: optionalType,
    lastName: optionalType,
    jobTitle: optionalType,
    city: optionalType,
    country: optionalType,
    phone: optionalType,
    email: optionalType,
})

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>

export const workExperienceSchema = z.object({
    workExperience: z.array(z.object({
        position: optionalType,
        company: optionalType,
        startDate: optionalType,
        endDate: optionalType,
        description: optionalType
    })).optional()
})

export type WorkExperienceValues = z.infer<typeof workExperienceSchema>

export const educationSchema = z.object({
    education: z.array(z.object({
        degree: optionalType,
        school:  optionalType,
        startDate: optionalType,
        endDate: optionalType,
    })).optional()
})

export const skillSchema = z.object({
    skills: z.array(z.string().trim()).optional()
})

export type SkillsValues = z.infer<typeof skillSchema>

export const summarySchema = z.object({
    summary: optionalType
})

export type SummaryValues = z.infer<typeof summarySchema>

export const resumeSchema = z.object({
    ...generalInfoSchema.shape,
    ...personalInfoSchema.shape,
    ...workExperienceSchema.shape,
    ...educationSchema.shape,
    ...skillSchema.shape,
    ...summarySchema.shape,
    colorHex: optionalType,
    borderStyle: optionalType,
})

export type EducationValues = z.infer<typeof educationSchema>

export type ResumeData = Omit<z.infer<typeof resumeSchema>, "photo"> & {
    id?: string,
    userId?: string,
    photo?: Blob | string | null,
    updatedAt?: Date,
    createdAt?: Date,
    general_info?: GeneralInfoValues
}