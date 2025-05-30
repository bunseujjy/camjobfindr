// types.ts
export type UserData = {
    id: string;
    firstName: string | null;  // Updated to allow null
    lastName: string | null;   // Updated to allow null
    username: string | null;
    clerkUserId: string;
    email: string;
    role: 'jobSeeker' | 'employer' | 'admin';
    imageUrl: string | null;   // Updated to allow null
    location: string | null;   // Updated to allow null
    bio: string | null;        // Updated to allow null
    skills: string[] | null;   // Updated to allow null
    resume: string | null;     // Updated to allow null
    companyName: string | null; // Updated to allow null
    companyWebsite: string | null; // Updated to allow null
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export type UserType = {
    clerkUserId: string | null;
    userId: string | undefined;
    role: "jobSeeker" | "employer" | "admin" | undefined;
    user: UserData | null;
}
