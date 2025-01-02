
import { post, get, patch } from '@/core/api/apiService';
import { ApiResponse } from '@/core/api/apiService';
import { getCurrentUser } from '@/core/auth/authService';
import { IMadrasah } from '../interfaces';
import { removeEmptyFields } from '@/utils/object.utils';


const MAIN_URL = process.env.NEXT_PUBLIC_MAIN_URL;

export type MadrasahApiResponse = ApiResponse<IMadrasah>;
export type MadrasahListApiResponse = ApiResponse<IMadrasah[]>;

export const registerMadrasah = async (formData: any): Promise<ApiResponse<IMadrasah>> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return {
      success: false,
      statusCode: 401,
      message: 'User not authenticated',
      data: null,
    };
  }

  const registrationData = removeEmptyFields({
    ...formData,
    status: formData.status || 'pending'
  });
  console.log('🚀 ~ file: madrasahService.ts:50 ~ registerMadrasah ~ registrationData:', registrationData);

  try {
    const response = await post<IMadrasah>('/madrasah/register', registrationData);
    console.log('🔥 Register Response:', response);
    return response;
  } catch (error) {
    console.error('❌ Register Error:', error);
    throw error;
  }
};

export const getAllMadrasahs = async (page: number = 1, limit: number = 10): Promise<ApiResponse<IMadrasah[]>> => {
  try {
    const response = await get<IMadrasah[]>(`/madrasah?page=${page}&limit=${limit}`);
    console.log('🔥 Get All Response:', response);
    return response;
  } catch (error) {
    console.error('❌ Get All Error:', error);
    throw error;
  }
};

export const getMadrasahById = async (id: string): Promise<ApiResponse<IMadrasah>> => {
  try {
    const response = await get<IMadrasah>(`/madrasah/${id}`);
    console.log('🔥 Get By Id Response:', response);
    return response;
  } catch (error) {
    console.error('❌ Get By Id Error:', error);
    throw error;
  }
};

export const createMadrasah = async (data: any): Promise<ApiResponse<IMadrasah>> => {
  try {
    const response = await post<IMadrasah>('/madrasah', data);
    console.log('🔥 Create Response:', response);
    return response;
  } catch (error) {
    console.error('❌ Create Error:', error);
    throw error;
  }
};

export const updateMadrasahBasicInfo = async (
  id: string,
  data: any
): Promise<ApiResponse<IMadrasah>> => {
  try {
    const response = await patch<IMadrasah>(`/madrasah/${id}/basic-info`, data);
    console.log('🔥 Update Basic Info Response:', response);
    return response;
  } catch (error) {
    console.error('❌ Update Basic Info Error:', error);
    throw error;
  }
};

export const updateMadrasahAddress = async (id: string, data: any): Promise<ApiResponse<IMadrasah>> => {
  try {
    const response = await patch<IMadrasah>(`/madrasah/${id}/address`, data);
    console.log('🔥 Update Address Response:', response);
    return response;
  } catch (error) {
    console.error('❌ Update Address Error:', error);
    throw error;
  }
};

export const updateMadrasahMuhtamim = async (id: string, data: any): Promise<ApiResponse<IMadrasah>> => {
  try {
    const response = await patch<IMadrasah>(`/madrasah/${id}/muhtamim`, data);
    console.log('🔥 Update Muhtamim Response:', response);
    return response;
  } catch (error) {
    console.error('❌ Update Muhtamim Error:', error);
    throw error;
  }
};

export const updateMadrasahChairmanMutawalli = async (id: string, data: any): Promise<ApiResponse<IMadrasah>> => {
  try {
    const response = await patch<IMadrasah>(`/madrasah/${id}/chairman-mutawalli`, data);
    console.log('🔥 Update Chairman Mutawalli Response:', response);
    return response;
  } catch (error) {
    console.error('❌ Update Chairman Mutawalli Error:', error);
    throw error;
  }
};

export const updateMadrasahEducationalSecretary = async (id: string, data: any): Promise<ApiResponse<IMadrasah>> => {
  try {
    const response = await patch<IMadrasah>(`/madrasah/${id}/educational-secretary`, data);
    console.log('🔥 Update Educational Secretary Response:', response);
    return response;
  } catch (error) {
    console.error('❌ Update Educational Secretary Error:', error);
    throw error;
  }
};

export const updateMadrasahInformation = async (
  id: string,
  data: {
    madrasah: string;
    highestMarhala: string;
    madrasahType: string;
    totalStudents: number;
    totalTeacherAndStuff: number;
  }
): Promise<ApiResponse<IMadrasah>> => {
  try {
    const response = await patch<IMadrasah>(`/madrasah/${id}/information`, data);
    console.log('🔥 Update Information Response:', response);
    return response;
  } catch (error) {
    console.error('❌ Update Information Error:', error);
    throw error;
  }
};
