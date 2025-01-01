import { post, get, patch } from './apiService';
import { Madrasah, MadrasahData } from '@/types/madrasah';
import { MadrasahBasicInfoUpdate } from '@/types/madrasahUpdate';
import { ApiResponse, ListApiResponse } from '@/types/api';
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

export type MadrasahResponse = ApiResponse<Madrasah>;
export type MadrasahListResponse = ListApiResponse<Madrasah>;

export async function registerMadrasah(formData: any): Promise<MadrasahResponse> {
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
      data: null
    };
  }

  if (!registrationData.email) {
    return {
      success: false,
      message: 'ইমেইল প্রদান করুন',
      data: null
    };
  }

  if (!registrationData.contactNo1) {
    return {
      success: false,
      message: 'মোবাইল নাম্বার প্রদান করুন',
      data: null
    };
  }

  try {
    const response = await post<MadrasahResponse>('/madrasah/create-by-admin', registrationData);
    return response;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || 'মাদরাসা নিবন্ধন করতে সমস্যা হয়েছে',
      data: null
    };
  }
}

export const getMadrasahList = async (page = 1, limit = 10): Promise<MadrasahListResponse> => {
  try {
    return await get<MadrasahListResponse>(`/madrasah?page=${page}&limit=${limit}`);
  } catch (error) {
    throw error;
  }
};

export const getAllMadrasahs = async (page: number = 1, limit: number = 10): Promise<MadrasahListResponse> => {
  try {
    const response = await get<MadrasahListResponse>(`/madrasah?page=${page}&limit=${limit}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getMadrasahById = async (id: string): Promise<MadrasahResponse> => {
  try {
    return await get<MadrasahResponse>(`/madrasah/${id}`);
  } catch (error) {
    throw error;
  }
};

export const createMadrasah = async (data: MadrasahBasicInfoUpdate): Promise<MadrasahResponse> => {
  try {
    const response = await post<MadrasahResponse>('/madrasah', data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateMadrasahBasicInfo = async (id: string, data: MadrasahBasicInfoUpdate): Promise<MadrasahResponse> => {
  try {
    return await patch<MadrasahResponse>(`/madrasah/${id}/basic-info`, data);
  } catch (error) {
    throw error;
  }
};

export const updateMadrasahAddress = async (id: string, data: any): Promise<MadrasahResponse> => {
  try {
    const response = await patch<MadrasahResponse>(`/madrasah/${id}/address`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateMadrasahMuhtamim = async (id: string, data: any): Promise<MadrasahResponse> => {
  try {
    const response = await patch<MadrasahResponse>(`/madrasah/${id}/muhtamim`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateMadrasahChairmanMutawalli = async (id: string, data: any): Promise<MadrasahResponse> => {
  try {
    const response = await patch<MadrasahResponse>(`/madrasah/${id}/chairman-mutawalli`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateMadrasahEducationalSecretary = async (id: string, data: any): Promise<MadrasahResponse> => {
  try {
    const response = await patch<MadrasahResponse>(`/madrasah/${id}/educational-secretary`, data);
    return response;
  } catch (error) {
    throw error;
  }
};
