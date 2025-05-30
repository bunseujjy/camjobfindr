import { pgTable, uuid } from "drizzle-orm/pg-core";
import { createdAt, id } from "../schemaHelpers";
import { UserTable } from "./user";
import { JobPostingTable } from "./job";
import { relations } from "drizzle-orm";

export const SavedJobsTable = pgTable('saved_jobs', {
  id,
  userId: uuid()
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  jobId: uuid()
    .notNull()
    .references(() => JobPostingTable.id, { onDelete: "cascade" }),
  createdAt
});

export const SavedJobsRelations = relations(SavedJobsTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [SavedJobsTable.userId],
    references: [UserTable.id]
  }),
  job: one(JobPostingTable, {
    fields: [SavedJobsTable.jobId],
    references: [JobPostingTable.id]
  })
}));