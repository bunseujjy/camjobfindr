import { useQuery } from "@tanstack/react-query";
import { fetchJob } from "../action/fetchJob";
import { fetchDBJob } from "@/features/job/actions/job";

export const useJobsData = () => {
    return useQuery({
        queryKey: ['feature-job'],
        queryFn: () => fetchJob(),
        staleTime: 360000,
        gcTime: 360000,
        retry: 3, // Retry failed requests 3 times
        refetchOnWindowFocus: false, // Disable refetching when window regains focus
    })
}

export const useJobsDataFromDB = () => {
    return useQuery({
        queryKey: ['job-from-database'],
        queryFn: () => fetchDBJob(),
        staleTime: 360000,
        gcTime: 360000,
        retry: 3, // Retry failed requests 3 times
        refetchOnWindowFocus: false, // Disable refetching when window regains focus
    })
}