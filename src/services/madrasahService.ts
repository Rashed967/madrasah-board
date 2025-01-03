import { IMadrasah } from '@/features/madrasah/interfaces';

import { getCurrentUser } from './authService';

import { removeEmptyFields } from '@/utils/object.utils';
import { ApiResponse } from '@/interfaces/api';
import { post, get, patch } from '@/core/api/apiService';


const MAIN_URL = process.env.NEXT_PUBLIC_MAIN_URL;

export type MadrasahApiResponse = ApiResponse<IMadrasah>;
export type MadrasahListApiResponse = ApiResponse<IMadrasah[]>;

export async function registerMadrasah(formData: any): Promise<ApiResponse<IMadrasah>> {
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin' || user?.role === 'super-admin';

  if (!isAdmin) {
    return {
      success: false as const,
      message: 'অননুমোদিত অ্যাক্সেস',
      data: null
    };
  }

  const registrationData = removeEmptyFields({
    ...formData,
    status: formData.status || 'pending'
  });
  console.log('🚀 ~ file: madrasahService.ts:50 ~ registerMadrasah ~ registrationData:', registrationData);

  try {
    const response = await post<IMadrasah>('/madrasah/create-by-admin', registrationData);
    return {
      success: true as const,
      message: response.message,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false as const,
      message: error?.response?.data?.message || 'মাদরাসা নিবন্ধন করতে সমস্যা হয়েছে',
      data: null
    };
  }
}

export const getAllMadrasahs = async (page: number = 1, limit: number = 10): Promise<ApiResponse<IMadrasah[]>> => {
  try {
    const response = await get<IMadrasah[]>(`/madrasah?page=${page}&limit=${limit}`);
    return {
      success: true as const,
      message: response.message,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false as const,
      message: error?.response?.data?.message || 'মাদরাসার তালিকা লোড করতে সমস্যা হয়েছে',
      data: null
    };
  }
};

export const getMadrasahById = async (id: string): Promise<ApiResponse<IMadrasah>> => {
  try {
    const response = await get<IMadrasah>(`/madrasah/${id}`);
    return {
      success: true as const,
      message: response.message,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false as const,
      message: error?.response?.data?.message || 'মাদরাসার তথ্য লোড করতে সমস্যা হয়েছে',
      data: null
    };
  }
};

export const createMadrasah = async (data: any): Promise<ApiResponse<IMadrasah>> => {
  try {
    const response = await post<IMadrasah>('/madrasah', data);
    return {
      success: true as const,
      message: response.message,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false as const,
      message: error?.response?.data?.message || 'মাদরাসা তৈরি করতে সমস্যা হয়েছে',
      data: null
    };
  }
};

export const updateMadrasahBasicInfo = async (
  id: string,
  data: any
): Promise<ApiResponse<IMadrasah>> => {
  try {
    console.log('🔥 Update Basic Info Response:', data);
    const response = await patch<IMadrasah>(`/madrasah/${id}`, data);
    return {
      success: true as const,
      message: response.message,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false as const,
      message: error?.response?.data?.message || 'মাদরাসার তথ্য আপডেট করতে সমস্যা হয়েছে',
      data: null
    };
  }
};

export const updateMadrasahAddress = async (id: string, data: any): Promise<ApiResponse<IMadrasah>> => {
  try {
    const response = await patch<IMadrasah>(`/madrasah/${id}/address`, data);
    return {
      success: true as const,
      message: response.message,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false as const,
      message: error?.response?.data?.message || 'মাদরাসার ঠিকানা আপডেট করতে সমস্যা হয়েছে',
      data: null
    };
  }
};

export const updateMadrasahMuhtamim = async (id: string, data: any): Promise<ApiResponse<IMadrasah>> => {
  try {
    const response = await patch<IMadrasah>(`/madrasah/${id}/muhtamim`, data);
    return {
      success: true as const,
      message: response.message,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false as const,
      message: error?.response?.data?.message || 'মাদরাসার মুহতামিম আপডেট করতে সমস্যা হয়েছে',
      data: null
    };
  }
};

export const updateMadrasahChairmanMutawalli = async (id: string, data: any): Promise<ApiResponse<IMadrasah>> => {
  try {
    const response = await patch<IMadrasah>(`/madrasah/${id}/chairman-mutawalli`, data);
    return {
      success: true as const,
      message: response.message,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false as const,
      message: error?.response?.data?.message || 'মাদরাসার চেয়ারম্যান মুতাওয়াল্লি আপডেট করতে সমস্যা হয়েছে',
      data: null
    };
  }
};

export const updateMadrasahEducationalSecretary = async (id: string, data: any): Promise<ApiResponse<IMadrasah>> => {
  try {
    const response = await patch<IMadrasah>(`/madrasah/${id}/educational-secretary`, data);
    return {
      success: true as const,
      message: response.message,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false as const,
      message: error?.response?.data?.message || 'মাদরাসার শিক্ষা সচিব আপডেট করতে সমস্যা হয়েছে',
      data: null
    };
  }
};




export const updateMadrasahInformation = async (
  id: string,
  data: Partial<IMadrasah['madrasah_information']>
): Promise<ApiResponse<IMadrasah>> => {
  try {
    const response = await patch<IMadrasah>(`/madrasah-information/${id}`, data);
    return {
      success: true as const,
      message: response.message,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false as const,
      message: error?.response?.data?.message || 'মাদরাসার তথ্য আপডেট করতে সমস্যা হয়েছে',
      data: null
    };
  }
};
