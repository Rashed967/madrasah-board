import { IZone } from "./zone.interfaces";
import { validateZone, ZoneInput } from "./zone.validations";
import * as apiService from '@/core/api/apiService';
import { ApiResponse } from '@/core/api/apiService';

export async function createZone(data: ZoneInput): Promise<ApiResponse<IZone>> {
  // Validate the data before sending to API
  const validationResult = validateZone(data);
  
  if (!validationResult.success) {
    return {
      success: false,
      statusCode: 400,
      message: validationResult.errors?.join(', ') || 'ভ্যালিডেশন এরর',
      data: null
    };
  }
  const response = await apiService.post<IZone>('/zones', validationResult.data);
  return response;
}

export async function getAllZones(): Promise<ApiResponse<IZone[]>> {
  const response = await apiService.get<IZone[]>('/zones');
  return response;
}

export const deleteZone = async (id: string) => {
  try {
    const response = await apiService.del(`/zones/${id}`);
    return {
      success: true as const,
      message: response.message || 'জোন ডিলিট করা হয়েছে'
    };
  } catch (error: any) {
    return {
      success: false as const,
      message: error?.response?.data?.message || 'জোন ডিলিট করতে সমস্যা হয়েছে',
      data: null
    };
  }
};
