
import { post, get, patch } from '@/core/api/apiService';
import { ApiResponse } from '@/core/api/apiService';
import { getCurrentUser } from '@/core/auth/authService';
import { IMadrasah } from '../interfaces';
import { removeEmptyFields } from '@/utils/object.utils';
import { ObjectId, Types } from 'mongoose';


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

  try {
    const response = await post<IMadrasah>('/madrasah/register', registrationData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllMadrasahs = async (page: number = 1, limit: number = 10): Promise<ApiResponse<IMadrasah[]>> => {
  try {
    const response = await get<IMadrasah[]>(`/madrasah?page=${page}&limit=${limit}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getMadrasahById = async (id: string): Promise<ApiResponse<IMadrasah>> => {
  try {
    const response = await get<IMadrasah>(`/madrasah/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createMadrasah = async (data: any): Promise<ApiResponse<IMadrasah>> => {
  try {
    const response = await post<IMadrasah>('/madrasah', data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateMadrasahBasicInfo = async (
  id: string,
  data: any
): Promise<ApiResponse<IMadrasah>> => {
  try {
    const response = await patch<IMadrasah>(`/madrasah/${id}/basic-info`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateMadrasahAddress = async (id: string, data: any): Promise<ApiResponse<IMadrasah>> => {
  try {
    const response = await patch<IMadrasah>(`/madrasah/${id}/address`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateMadrasahMuhtamim = async (id: string, data: any): Promise<ApiResponse<IMadrasah>> => {
  try {
    const response = await patch<IMadrasah>(`/madrasah/${id}/muhtamim`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateMadrasahChairmanMutawalli = async (id: string, data: any): Promise<ApiResponse<IMadrasah>> => {
  try {
    const response = await patch<IMadrasah>(`/madrasah/${id}/chairman-mutawalli`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateMadrasahEducationalSecretary = async (id: string, data: any): Promise<ApiResponse<IMadrasah>> => {
  try {
    const response = await patch<IMadrasah>(`/madrasah/${id}/educational-secretary`, data);
    return response;
  } catch (error) {
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
    return response;
  } catch (error) {
    throw error;
  }
};
