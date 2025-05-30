import { pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";
import { UserTable } from "./user";
import { CompanyTable } from "./company";
import { relations } from "drizzle-orm";
import { createdAt } from "../schemaHelpers";

export const CompanyUserTable = pgTable("company_users", {
    companyId: uuid().notNull().references(() => CompanyTable.id, { onDelete: "cascade" }),
    userId: uuid().notNull().references(() => UserTable.id, { onDelete: "cascade" }),
    role: text().notNull(), // e.g., admin, employee
    createdAt
}, t => [primaryKey({ columns: [t.companyId, t.userId] })]);

export const CompanyUserRelations = relations(CompanyUserTable, ({ one }) => ({
    company: one(CompanyTable, {
        fields: [CompanyUserTable.companyId],
        references: [CompanyTable.id]
    }),
    user: one(UserTable, {
        fields: [CompanyUserTable.userId],
        references: [UserTable.id]
    })
}));