import { z } from "zod";

// Regex for prohibited characters in the local part of the email
const prohibitedChars = /[()<>[\]:;@\\,/" ]/

export const companySchema = z.object({
    name: z.string().min(1, "Required"),
    website: z.string().nullable(),
    company_size: z.string().min(1, "Required"),
    logo: z.string().nullable(),
    industry: z.string().min(1, "Required"),
    location: z.string().min(1, "Required"),
    email: z
    .string()
    .email()
    .min(1, "Required")
    .refine(
      (email) => {
        const [localPart] = email.split("@")

        // Check if local part has any prohibited characters or consecutive dots
        return (
          !prohibitedChars.test(localPart) &&
          !localPart.startsWith(".") &&
          !localPart.endsWith(".") &&
          !localPart.includes("..")
        )
      },
      {
        message: "Email ID contains prohibited characters",
      }
    ),
    phone_number: z.string().nullable(),
    description: z.string(),
    facebook_url: z.string().optional(),
    linkedin_url: z.string().optional(),
    twitter_url: z.string().optional(),
    instagram_url: z.string().optional(),
})