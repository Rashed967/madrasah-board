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
  const response = await apiService.get<IZone[]>('/zones?limit=1000'); // Set a high limit to get all zones
  return response;
}
