import { fetchCompany } from "@/features/company/actions/company"
import { useQuery } from "@tanstack/react-query"

export const useCompanyData = () => {
    return useQuery({
        queryKey: ['company-data'],
        queryFn: fetchCompany,
        staleTime: 360000,
        gcTime: 360000,
        retry: 3, // Retry failed requests 3 times
        refetchOnWindowFocus: false, // Disable refetching when window regains focus
    })
}