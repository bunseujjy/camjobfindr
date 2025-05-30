import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { CompanyTable } from "./company";
import { createdAt, id } from "../schemaHelpers";
import { relations } from "drizzle-orm";

export const TeamMemberTable = pgTable("team_member", {
    id,
    companyId: uuid().notNull().references(() => CompanyTable.id),
    name: text().notNull(),
    position: text().notNull(),
    avatar: text(),
    createdAt
});


export const TeamMemberRelations = relations(TeamMemberTable, ({ one }) => ({
    company: one(CompanyTable, {
        fields: [TeamMemberTable.companyId],
        references: [CompanyTable.id]
    })
}));
