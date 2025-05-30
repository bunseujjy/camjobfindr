import { jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core"
import { createdAt, id, updatedAt } from "../schemaHelpers"
import { UserTable } from "./user"
import { relations } from "drizzle-orm";

export const ResumeTable = pgTable('resume', {
    id,
    userId: uuid().notNull().references(() => UserTable.id),
    photoUrl: text(),
    general_info: jsonb().notNull(),
    personal_info: jsonb().notNull(),
    work_experiences: jsonb().notNull().default([]), // Add default empty array
    education: jsonb().notNull().default([]), // Add default empty array
    skills: text().array().notNull().default([]), // Add default empty array
    summary: text().notNull().default(""), // Add default empty string
    color: text(), // Custom color for the resume (e.g., hex code)
    border: text(), // Custom border style for the resume (e.g., "solid", "dashed")
    createdAt,
    updatedAt
})

export const ResumeRelations = relations(ResumeTable, ({ one }) => ({
    user: one(UserTable, {
      fields: [ResumeTable.userId],
      references: [UserTable.id],
    }),
  }));