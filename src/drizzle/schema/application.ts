import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createdAt, id } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { UserTable } from "./user";
import { JobPostingTable } from "./job";
import { ResumeTable } from "./resume";

export const applicationStatus = ['pending', 'interviewing', 'rejected'] as const;
export type ApplicationStatus = (typeof applicationStatus)[number];
export const ApplicationStatusEnum = pgEnum("application_status", applicationStatus);

export const ApplicationTable = pgTable("applications", {
    id,
    userId: uuid().notNull().references(() => UserTable.id, { onDelete: "cascade" }),
    jobId: uuid().notNull().references(() => JobPostingTable.id, { onDelete: "cascade" }),
    resume: text().notNull(),
    status: ApplicationStatusEnum().default("pending"),
    appliedAt: timestamp({ withTimezone: true }).defaultNow(),
    createdAt
});

export const ApplicationRelations = relations(ApplicationTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [ApplicationTable.userId],
        references: [UserTable.id]
    }),
    job: one(JobPostingTable, {
        fields: [ApplicationTable.jobId],
        references: [JobPostingTable.id]
    }),
    resume: one(ResumeTable, {
        fields: [ApplicationTable.userId],
        references: [ResumeTable.userId]
    })
}));