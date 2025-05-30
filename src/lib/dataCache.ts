type CACHE_TAG =
  | "users"
  | "company"
  | "job"
  | "userJobTag"
  | "applicant"
  | "userCopmpanyTag"
  | "userApplicantTag"
  | "saved_job"
  | "userSavedJobTag";

export function getGlobalTag(tag: CACHE_TAG) {
  return `global:${tag}` as const;
}

export function getIdTag(tag: CACHE_TAG, id: string) {
  return `id:${id}-${tag}` as const;
}

export function getUserTag(tag: CACHE_TAG, userId: string) {
  return `user:${userId}-${tag}` as const;
}
