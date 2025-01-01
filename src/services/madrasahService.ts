import { post, get, patch } from './apiService';
import { ApiResponse, ListResponse } from '@/types/common';
import { Madrasah, MadrasahBasicInfoUpdate, MadrasahData, MadrasahApiResponse, MadrasahListApiResponse, MadrasahAddress } from '@/types/madrasah';
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

export interface MadrasahListResponse extends ListResponse<Madrasah> {}

export async function registerMadrasah(formData: any): Promise<MadrasahApiResponse> {
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin' || user?.role === 'super-admin';

  const registrationData: Partial<MadrasahData> = {
    madrasahNames: transformMadrasahNames(formData),
    code: formData.code || '',
    email: formData.email || '',
    description: formData.description || '',
    communicatorName: formData.communicatorName || '',
    contactNo1: formData.contactNo1 || '',
    contactNo2: formData.contactNo2 || '',
    address: transformAddress(formData),
    madrasah_information: transformMadrasahInfo(formData),
    ilhakImage: formData.ilhakImage
  };

  if (formData.muhtamimName) {
    registrationData.muhtamim = transformMuhtamim(formData);
  }

  if (formData.mutawalliName) {
    registrationData.chairman_mutawalli = transformChairmanMutawalli(formData);
  }

  if (formData.shikkhaSocheebName) {
    registrationData.educational_secretory = transformEducationalSecretary(formData);
  }

  // Basic validation
  if (!registrationData.madrasahNames?.bengaliName) {
    return {
      success: false,
      message: 'বাংলা নাম প্রদান করুন',
      data: {} as Madrasah
    };
  }

  if (!registrationData.email) {
    return {
      success: false,
      message: 'ইমেইল প্রদান করুন',
      data: {} as Madrasah
    };
  }

  if (!registrationData.contactNo1) {
    return {
      success: false,
      message: 'মোবাইল নাম্বার প্রদান করুন',
      data: {} as Madrasah
    };
  }

  try {
    const response = await post<MadrasahApiResponse>('/madrasah/create-by-admin', registrationData);
    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'মাদরাসা নিবন্ধন করতে সমস্যা হয়েছে',
      data: {} as Madrasah
    };
  }
}

export const getMadrasahList = async (page = 1, limit = 10): Promise<MadrasahListApiResponse> => {
  try {
    const response = await get<MadrasahListApiResponse>(`/madrasah?page=${page}&limit=${limit}`);
    return {
      success: response.success,
      message: response.message,
      data: response.data.data,
      meta: response.data.meta
    };
  } catch (error) {
    throw error;
  }
};

export const getAllMadrasahs = async (page: number = 1, limit: number = 10): Promise<MadrasahListApiResponse> => {
  try {
    const response = await get<MadrasahListApiResponse>(`/madrasah?page=${page}&limit=${limit}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getMadrasahById = async (id: string): Promise<MadrasahApiResponse> => {
  try {
    const response = await get<MadrasahApiResponse>(`/madrasah/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createMadrasah = async (data: MadrasahBasicInfoUpdate): Promise<MadrasahApiResponse> => {
  try {
    const response = await post<MadrasahApiResponse>('/madrasah', data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateMadrasahBasicInfo = async (id: string, data: MadrasahBasicInfoUpdate): Promise<MadrasahApiResponse> => {
  try {
    const response = await patch<MadrasahApiResponse>(`/madrasah/${id}/basic-info`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateMadrasahAddress = async (id: string, data: MadrasahAddress): Promise<MadrasahApiResponse> => {
  try {
    const response = await patch<MadrasahApiResponse>(`/madrasah/${id}/address`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateMadrasahMuhtamim = async (id: string, data: any): Promise<MadrasahApiResponse> => {
  try {
    const response = await patch<MadrasahApiResponse>(`/madrasah/${id}/muhtamim`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateMadrasahChairmanMutawalli = async (id: string, data: any): Promise<MadrasahApiResponse> => {
  try {
    const response = await patch<MadrasahApiResponse>(`/madrasah/${id}/chairman-mutawalli`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateMadrasahEducationalSecretary = async (id: string, data: any): Promise<MadrasahApiResponse> => {
  try {
    const response = await patch<MadrasahApiResponse>(`/madrasah/${id}/educational-secretary`, data);
    return response;
  } catch (error) {
    throw error;
  }
};
