import { db } from "@/drizzle/db"
import { UserRole, UserTable } from "@/drizzle/schema"
import { UserData, UserType } from "@/features/users/types/type"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"

// Initialize client without top-level await
const client = clerkClient();

export async function getCurrentUser({ allData = false } = {}): Promise<UserType> {
  const { userId, sessionClaims } = await auth();
  let userData: UserData | null = null;
  
  if (allData && sessionClaims?.dbId != null) {
    const user = await getUser(sessionClaims.dbId);
    userData = user || null;
  }
  
  return {
    clerkUserId: userId,
    userId: sessionClaims?.dbId,
    role: sessionClaims?.role as "jobSeeker" | "employer" | "admin" | undefined,
    user: userData,
  };
}

export async function syncClerkUserMetadata(user: {
  id: string
  clerkUserId: string
  role: UserRole
}) {
  return (await client).users.updateUserMetadata(user.clerkUserId, {
    publicMetadata: {
      dbId: user.id,
      role: user.role,
    },
  });
}

async function getUser(id: string) {
  "use cache"
  return db.query.UserTable.findFirst({
    where: eq(UserTable.id, id),
    with: {
      resume: true
    }
  })
}