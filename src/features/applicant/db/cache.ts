import { getGlobalTag, getIdTag, getUserTag } from "@/lib/dataCache"
import { revalidateTag } from "next/cache"

export function getApplicantGlobalTag() {
  return getGlobalTag("applicant")
}

export function getApplicantIdTag(id: string) {
  return getIdTag("applicant", id)
}

export function getUserApplicantTag(userId: string) {
  return getUserTag('userApplicantTag', userId)
}

export function revalidateApplicantTag(id: string) {
  revalidateTag(getApplicantGlobalTag())
  revalidateTag(getApplicantIdTag(id))
  revalidateTag(getUserApplicantTag(id))
}