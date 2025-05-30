"use server"

import { z } from "zod"
import { companySchema } from "../schema/companySchema"
import { insertCompany } from "../db/company"
import { db } from "@/drizzle/db"

export const createCompany = async (unsafeData: z.infer<typeof companySchema>, userId: string) => {
    const { success, data } = companySchema.safeParse(unsafeData)

    if(!success) {
        return { error: true, message: "There was an error creating your company" }
    }

    await insertCompany(data, userId)
}

export const fetchCompany = async () => {
    try {
        const data = await db.query.CompanyTable.findMany()

        if(!data) {
            throw new Error("failed to fetch company")
        }

        return data
    } catch (error) {
        console.error(error)
    }
}