import { post, get, patch } from './apiService';
import { Madrasah, MadrasahData } from '@/types/madrasah';
import { MadrasahBasicInfoUpdate } from '@/types/madrasahUpdate';
import { ApiResponse } from './apiService';
import { getCurrentUser } from './authService';
import {
  transformMadrasahNames,
  transformAddress,
  transformMadrasahInfo,
  transformMuhtamim,
  transformChairmanMutawalli,
  transformEducationalSecretary
} from '@/utils/transformers';

const MAIN_URL = process.env.NEXT_PUBLIC_MAIN_URL;

export type MadrasahApiResponse = ApiResponse<Madrasah>;
export type MadrasahListApiResponse = ApiResponse<Madrasah[]>;

export async function registerMadrasah(formData: any): Promise<ApiResponse<Madrasah>> {
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin' || user?.role === 'super-admin';

  if (!isAdmin) {
    return {
      success: false,
      statusCode: 403,
      message: 'অননুমোদিত অ্যাক্সেস',
      data: null as any
    };
  }

  const registrationData = {
    ...transformMadrasahNames(formData),
    ...transformAddress(formData),
    ...transformMadrasahInfo(formData),
    ...transformMuhtamim(formData),
    ...transformChairmanMutawalli(formData),
    ...transformEducationalSecretary(formData),
  };

  if (!registrationData.contactNo1) {
    return {
      success: false,
      statusCode: 400,
      message: 'মোবাইল নাম্বার প্রদান করুন',
      data: null as any
    };
  }

  try {
    const response = await post<Madrasah>('/madrasah/create-by-admin', registrationData);
    return response;
  } catch (error: any) {
    return {
      success: false,
      statusCode: error?.response?.status || 500,
      message: error?.response?.data?.message || 'মাদরাসা নিবন্ধন করতে সমস্যা হয়েছে',
      data: null as any
    };
  }
}

export const getMadrasahList = async (page = 1, limit = 10): Promise<ApiResponse<Madrasah[]>> => {
  try {
    const response = await get<ApiResponse<Madrasah[]>>(`/madrasah?page=${page}&limit=${limit}`);
    return response;
  } catch (error: any) {
    return {
      success: false,
      statusCode: error?.response?.status || 500,
      message: error?.response?.data?.message || 'মাদরাসার তালিকা লোড করতে সমস্যা হয়েছে',
      data: null as any
    };
  }
};

export const getAllMadrasahs = async (page: number = 1, limit: number = 10): Promise<ApiResponse<Madrasah[]>> => {
  try {
    const response = await get<ApiResponse<Madrasah[]>>(`/madrasah?page=${page}&limit=${limit}`);
    return response;
  } catch (error: any) {
    return {
      success: false,
      statusCode: error?.response?.status || 500,
      message: error?.response?.data?.message || 'মাদরাসার তালিকা লোড করতে সমস্যা হয়েছে',
      data: null as any
    };
  }
};

export const getMadrasahById = async (id: string): Promise<ApiResponse<Madrasah>> => {
  try {
    const response = await get<ApiResponse<Madrasah>>(`/madrasah/${id}`);
    return response;
  } catch (error: any) {
    return {
      success: false,
      statusCode: error?.response?.status || 500,
      message: error?.response?.data?.message || 'মাদরাসার তথ্য লোড করতে সমস্যা হয়েছে',
      data: null as any
    };
  }
};

export const createMadrasah = async (data: MadrasahBasicInfoUpdate): Promise<ApiResponse<Madrasah>> => {
  try {
    const response = await post<Madrasah>('/madrasah', data);
    return response;
  } catch (error: any) {
    return {
      success: false,
      statusCode: error?.response?.status || 500,
      message: error?.response?.data?.message || 'মাদরাসা তৈরি করতে সমস্যা হয়েছে',
      data: null as any
    };
  }
};

export const updateMadrasahBasicInfo = async (
  id: string,
  data: MadrasahBasicInfoUpdate
): Promise<ApiResponse<Madrasah>> => {
  try {
    const response = await patch<Madrasah>(`/madrasah/${id}/basic-info`, data);
    return response;
  } catch (error: any) {
    return {
      success: false,
      statusCode: error?.response?.status || 500,
      message: error?.response?.data?.message || 'মাদরাসার তথ্য আপডেট করতে সমস্যা হয়েছে',
      data: null as any
    };
  }
};

export const updateMadrasahAddress = async (id: string, data: any): Promise<ApiResponse<Madrasah>> => {
  try {
    const response = await patch<Madrasah>(`/madrasah/${id}/address`, data);
    return response;
  } catch (error: any) {
    return {
      success: false,
      statusCode: error?.response?.status || 500,
      message: error?.response?.data?.message || 'মাদরাসার ঠিকানা আপডেট করতে সমস্যা হয়েছে',
      data: null as any
    };
  }
};

export const updateMadrasahMuhtamim = async (id: string, data: any): Promise<ApiResponse<Madrasah>> => {
  try {
    const response = await patch<Madrasah>(`/madrasah/${id}/muhtamim`, data);
    return response;
  } catch (error: any) {
    return {
      success: false,
      statusCode: error?.response?.status || 500,
      message: error?.response?.data?.message || 'মাদরাসার মুহতামিম আপডেট করতে সমস্যা হয়েছে',
      data: null as any
    };
  }
};

export const updateMadrasahChairmanMutawalli = async (id: string, data: any): Promise<ApiResponse<Madrasah>> => {
  try {
    const response = await patch<Madrasah>(`/madrasah/${id}/chairman-mutawalli`, data);
    return response;
  } catch (error: any) {
    return {
      success: false,
      statusCode: error?.response?.status || 500,
      message: error?.response?.data?.message || 'মাদরাসার চেয়ারম্যান মুতাওয়াল্লি আপডেট করতে সমস্যা হয়েছে',
      data: null as any
    };
  }
};

export const updateMadrasahEducationalSecretary = async (id: string, data: any): Promise<ApiResponse<Madrasah>> => {
  try {
    const response = await patch<Madrasah>(`/madrasah/${id}/educational-secretary`, data);
    return response;
  } catch (error: any) {
    return {
      success: false,
      statusCode: error?.response?.status || 500,
      message: error?.response?.data?.message || 'মাদরাসার শিক্ষা সচিব আপডেট করতে সমস্যা হয়েছে',
      data: null as any
    };
  }
};
