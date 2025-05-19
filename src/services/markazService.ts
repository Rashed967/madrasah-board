import { get } from "@/core/api/apiService";


interface MarkazListParams {
  zoneIds: string[];
  districts: string[];
  madrasahType: 'বালক' | 'বালিকা' | 'উভয়';
  marhalaCategory: 'darsiyat' | 'hifz' | 'both';
}

export const markazService = {
  getAllMarkazWithStudentList: async (params: MarkazListParams) => {
    try {
      const queryParams = new URLSearchParams({
        zoneIds: params.zoneIds.join(','),
        districts: params.districts.join(','),
        madrasahType: params.madrasahType,
        marhalaCategory: params.marhalaCategory
      });

      const response = await get(
        `/markazs/all-markaz-with-student-list?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 