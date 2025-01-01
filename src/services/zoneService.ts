import { get, post, ApiResponse } from './apiService';

export interface CreateZoneData {
  name: string;
  allDistricts: string[];
}

export interface Zone {
  _id: string;
  name: string;
  code: string;
  allDistricts: string[];
  allMarkazs: any[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateZoneResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Zone;
}

export interface GetAllZonesResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: Zone[];
}

export async function createZone(data: CreateZoneData): Promise<ApiResponse<Zone>> {
  const response = await post<Zone>('/zones', data);
  return response;
}

export async function getAllZones(): Promise<ApiResponse<Zone[]>> {
  const response = await get<Zone[]>('/zones?limit=1000'); // Set a high limit to get all zones
  return response;
}
