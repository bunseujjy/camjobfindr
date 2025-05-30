import {  pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createdAt, id } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { ApplicationTable } from "./application";
import { CompanyTable } from "./company";
import { UserTable } from "./user";

export const jobType = ["full-time", "part-time", "remote", "internship"] as const;
export type JobType = (typeof jobType)[number];
export const jobTypeEnum = pgEnum("job_types", jobType);
export const availableStatus = ['open', 'closed'] as const;
export type AvailableStatus = (typeof availableStatus)[number];
export const AvailableStatusEnum = pgEnum("available_status", availableStatus);


export const JobPostingTable = pgTable("job_posting", {
    id,
    job_title: text().notNull(),
    company_name: text().notNull(),
    description: text().notNull(),
    about_role: text().notNull(),
    location: text().notNull(),
    salary: text().notNull(),
    job_type: jobTypeEnum().notNull(),
    available: AvailableStatusEnum().default('open'),  // Changed default to 'open'
    industry: text(),
    skillsRequired: text().array(),
    experiences: text().notNull().default("Not specified"),
    companyId: uuid().notNull().references(() => CompanyTable.id, { onDelete: "cascade" }),
    postedById: uuid().notNull().references(() => UserTable.id),
    createdAt,
    expiresAt: timestamp({ withTimezone: true })
});

export const JobPostingRelations = relations(JobPostingTable, ({ many, one }) => ({
    applications: many(ApplicationTable),
    company: one(CompanyTable, {
        fields: [JobPostingTable.companyId],
        references: [CompanyTable.id]
    }),
    postedBy: one(UserTable, {
        fields: [JobPostingTable.postedById],
        references: [UserTable.id]
    })
}));