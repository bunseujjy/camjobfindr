import { ResumeData } from "@/features/resume/schema/resumeSchema";
import useDebounced from "./useDebounce";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { saveResume } from "@/features/resume/db/action/action";
import { toast } from "sonner";
import { fileReplacer } from "@/lib/utils";

export default function useAutoSave(formData: ResumeData) {
    const searchParams = useSearchParams();

    const debouncedResumeData = useDebounced(formData, 1500)

    const [resumeId, setResumeId]  = useState(formData.id)

    const [lastSavedData, setLastSavedData] = useState(structuredClone(formData))

    const [isSaving, setIsSaving] = useState(false)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        setIsError(false)
    }, [debouncedResumeData])

    useEffect(() => {
        async function save() {
            try {
            setIsSaving(true)
            setIsError(false)
        

            const newData = structuredClone(debouncedResumeData)
            const updatedResumeData = await saveResume({
                ...newData,
                ...(JSON.stringify(lastSavedData.photo, fileReplacer) === JSON.stringify(newData.photo, fileReplacer) && {
                    photo: undefined
                }),
                id: resumeId
            });

        setResumeId(updatedResumeData[0].id)
        setLastSavedData(newData)

        if (searchParams.get("resumeId") !== updatedResumeData[0].id) {
            const newSearchParams = new URLSearchParams(searchParams)
            newSearchParams.set("resumeId", updatedResumeData[0].id)
            window.history.replaceState(null, "", `?${newSearchParams.toString()}`)
        }
            } catch (error) {
                setIsError(true)
                console.error(error)
                toast.error("Error")
            } finally {
                setIsSaving(false)
            }

            await new Promise(resolve => setTimeout(resolve, 1500))
            setLastSavedData(structuredClone(debouncedResumeData))
            setIsSaving(false)
        }

        const hasUnsavedChanges = JSON.stringify(debouncedResumeData, fileReplacer) !== JSON.stringify(lastSavedData, fileReplacer)

        if(hasUnsavedChanges && debouncedResumeData && !isSaving && !isError) {
            save()
        }
    }, [debouncedResumeData, isSaving, lastSavedData, resumeId, searchParams, isError])

    return {
        isSaving,
        hasUnsavedData: JSON.stringify(formData) !== JSON.stringify(lastSavedData),
    }
}