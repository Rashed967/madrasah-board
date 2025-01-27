import { IKitab } from "./kitab.interface";
import * as apiService from '@/core/api/apiService';
import { ApiResponse } from '@/core/api/apiService';

export async function getAllKitabs(): Promise<ApiResponse<IKitab[]>> {
  const response = await apiService.get<IKitab[]>('/kitabs');
  return response;
}

export async function deleteKitab(id: string): Promise<ApiResponse<IKitab>> {
  const response = await apiService.del<IKitab>(`/kitabs/${id}`);
  return response;
}

export async function updateKitab(id: string, data: Partial<IKitab>): Promise<ApiResponse<IKitab>> {
  const response = await apiService.patch<IKitab>(`/kitabs/${id}`, data);
  return response;
}
