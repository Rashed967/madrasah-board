import { get } from "@/core/api/apiService";
import { useQuery } from "@tanstack/react-query";

interface IZone {
    _id: string;
    name: string;
    allDistricts: string[],
    code: string;
}

const useGetAllZones = (searchTerm: string) => {
    const queryParams = new URLSearchParams()
    queryParams.append('searchTerm', searchTerm)
   
    const fetchZones = async () => {
        const response = await get<IZone[]>(`/zones?${queryParams}`)
        
        return response
    }
    return useQuery({
        queryKey: ['zones', searchTerm],
        queryFn: fetchZones
    })
}

export default useGetAllZones;
