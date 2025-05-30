import { z } from "zod";

export const userSchema = z.object({
  id: z.string().min(1, "Required"),
  role: z.enum(["jobSeeker", "employer", "admin"])
});
