import { patch } from '@/core/api/apiService';
import { IMadrasah, IMadrasahAddress } from '@/features/madrasah/interfaces';
import { ApiResponse } from '@/shared/interfaces/api.interface';



export const updateMadrasahAddress = async (
  id: string,
  data: Partial<IMadrasahAddress>
): Promise<ApiResponse<IMadrasah>> => {
  try {


    const response = await patch<IMadrasah>(`/madrasah-addresses/${id}`, data);
    return {
      ...response,
      statusCode: 200
    };
  } catch (error) {
    throw error;
  }
};
