import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { ApplicationTable } from "./application";
import { CompanyUserTable } from "./companyUser";
import { ResumeTable } from "./resume";

export const userRoles = ["jobSeeker", "employer", "admin"] as const;
export type UserRole = (typeof userRoles)[number];
export const userRoleEnum = pgEnum("user_role", userRoles);

export const UserTable = pgTable("users", {
    id,
    firstName: text(),
    lastName: text(),
    clerkUserId: text().notNull().unique(),
    email: text().notNull(),
    username: text(),
    role: userRoleEnum().notNull().default("jobSeeker"),
    imageUrl: text(),
    location: text(),
    bio: text(),
    skills: text().array(),
    resume: text(),
    companyName: text(),
    companyWebsite: text(),
    deletedAt: timestamp({ withTimezone: true }),
    createdAt,
    updatedAt
});

export const UserRelations = relations(UserTable, ({ many }) => ({
    applications: many(ApplicationTable),
    companyUsers: many(CompanyUserTable),
    resume: many(ResumeTable)
  }));