import {  pgTable, text} from "drizzle-orm/pg-core";
import { createdAt, id } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { JobPostingTable } from "./job";
import { CompanyUserTable } from "./companyUser";
import { TeamMemberTable } from "./teamMember";

export const CompanyTable = pgTable("company", {
    id,
    name: text().notNull(),
    website: text(),
    company_size: text().notNull(),
    logo: text(),
    industry: text().notNull(),
    location: text().notNull(),
    email: text().notNull(),
    phone_number: text(),
    description: text(),
    facebook_url: text(),
    linkedin_url: text(),
    twitter_url: text(),
    instagram_url: text(),
    createdAt
});



export const CompanyRelations = relations(CompanyTable, ({ many }) => ({
    jobs: many(JobPostingTable),
    companyUsers: many(CompanyUserTable),
    teamMembers: many(TeamMemberTable)
}));
