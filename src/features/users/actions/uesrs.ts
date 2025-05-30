"use server";

import { z } from "zod";
import { updateRole } from "../db/users";
import { userSchema } from "../schema/userSchema";
import { redirect } from "next/navigation";

export const updateUserRole = async (
  unsafeData: z.infer<typeof userSchema>
) => {
  const { success, data } = userSchema.safeParse(unsafeData);

  if (!success) throw new Error("Failed to update user role.");

  await updateRole(data.id, data.role);

  redirect("/");
};
