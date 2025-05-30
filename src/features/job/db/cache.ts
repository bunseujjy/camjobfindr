import { getGlobalTag, getIdTag, getUserTag } from "@/lib/dataCache"
import { revalidateTag } from "next/cache"

export function getJobGlobalTag() {
  return getGlobalTag("job")
}

export function getJobIdTag(id: string) {
  return getIdTag("job", id)
}

export function getUserJobTag(userId: string) {
  return getUserTag('userJobTag', userId)
}

export function getSavedJobIdTag(id: string) {
  return getIdTag("saved_job", id)
}

export function getUserSavedJobTag(userId: string) {
  return getUserTag("userSavedJobTag", userId)
}

export function revalidateJobTag(id: string) {
  revalidateTag(getJobGlobalTag())
  revalidateTag(getJobIdTag(id))
  revalidateTag(getUserJobTag(id))
}