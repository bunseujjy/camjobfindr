import { getGlobalTag, getIdTag, getUserTag } from "@/lib/dataCache"
import { revalidateTag } from "next/cache"

export function getCompanyGlobalTag() {
  return getGlobalTag("company")
}

export function getCompanyIdTag(id: string) {
  return getIdTag("company", id)
}

export function getUserCompanyTag(userId: string) {
  return getUserTag('userCopmpanyTag', userId)
}

export function revalidateCompanyTag(id: string) {
  revalidateTag(getCompanyGlobalTag())
  revalidateTag(getCompanyIdTag(id))
  revalidateTag(getUserCompanyTag(id))
}