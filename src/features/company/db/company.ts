import { db } from "@/drizzle/db";
import { CompanyTable, CompanyUserTable } from "@/drizzle/schema";
import { revalidateCompanyTag } from "./cache";

export const insertCompany = async (
  companyData: typeof CompanyTable.$inferInsert,
  userId: string, // The user ID to associate with the company
  role: string = "admin" // Default role for the user in the company
) => {
  // Validate userId
  if (!userId) {
    throw new Error("User ID is required");
  }

  // Insert the company
  const [company] = await db
    .insert(CompanyTable)
    .values(companyData)
    .returning();

  if (!company) {
    throw new Error("Failed to create Company");
  }

  // Insert into CompanyUserTable to associate the user with the company
  await db.insert(CompanyUserTable).values({
    companyId: company.id, // Use the ID of the newly created company
    userId: userId, // The user ID to associate
    role: role, // The role of the user in the company
    createdAt: new Date(), // Timestamp
  });

  // Revalidate cache
  revalidateCompanyTag(company.id);

  return company;
};